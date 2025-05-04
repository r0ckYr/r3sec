// ./controllers/admin_report_controller.go
package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"r3sec/config"
	"r3sec/models"
)

// CreateAuditReport handles creation of a new audit report for a contract
func CreateAuditReport(c *gin.Context) {
	// Verify admin is authenticated
	admin, exists := c.Get("currentAdminUser")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin authentication error"})
		return
	}
	adminUser := admin.(models.AdminUser)

	// Parse request body
	var req struct {
		ContractID      string `json:"contract_id" binding:"required"`
		ReportURL       string `json:"report_url" binding:"required"`
		Summary         string `json:"summary" binding:"required"`
		SeveritySummary string `json:"severity_summary" binding:"required"`
		FindingsCount   int    `json:"findings_count" binding:"required,min=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Validate contract ID format
	contractObjID, err := primitive.ObjectIDFromHex(req.ContractID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contract ID format"})
		return
	}

	// Verify contract exists
	contractsColl := config.DB.Collection("contracts")
	var contract models.Contract
	err = contractsColl.FindOne(context.TODO(), bson.M{"_id": contractObjID}).Decode(&contract)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	// Check if report already exists for this contract
	reportsColl := config.DB.Collection("audit_reports")
	count, err := reportsColl.CountDocuments(context.TODO(), bson.M{"contract_id": req.ContractID})
	if err == nil && count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Report already exists for this contract"})
		return
	}

	// Create the audit report
	now := time.Now()
	auditReport := models.AuditReport{
		ContractID:      req.ContractID,
		UploadedBy:      adminUser.ID.Hex(),
		ReportURL:       req.ReportURL,
		Summary:         req.Summary,
		SeveritySummary: req.SeveritySummary,
		FindingsCount:   req.FindingsCount,
		UploadedAt:      now,
		UpdatedAt:       now,
	}

	// Insert report into database
	result, err := reportsColl.InsertOne(context.TODO(), auditReport)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create audit report"})
		return
	}

	// Get the ID of the inserted document
	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		auditReport.ID = oid.Hex()
	}

	// Update contract status to completed
	_, err = contractsColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": contractObjID},
		bson.M{
			"$set": bson.M{
				"status":     "completed",
				"updated_at": now,
			},
		},
	)

	// Create audit log entry
	log := models.AuditLog{
		ContractID: req.ContractID,
		Event:      "Report Uploaded",
		ActorID:    adminUser.ID.Hex(),
		ActorRole:  adminUser.Role,
		CreatedAt:  now,
	}

	logsColl := config.DB.Collection("audit_logs")
	logsColl.InsertOne(context.TODO(), log)

	// Create notification for user
	notification := models.Notification{
		UserID:    contract.UserID,
		Title:     "Audit Report Available",
		Body:      "Your audit report for " + contract.Name + " is now available.",
		IsRead:    false,
		CreatedAt: now,
		UpdatedAt: now,
	}

	notificationsColl := config.DB.Collection("notifications")
	notificationsColl.InsertOne(context.TODO(), notification)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Audit report created successfully",
		"report":  auditReport,
	})
}

// AddReportFindings adds findings to an existing audit report
func AddReportFindings(c *gin.Context) {
	// Verify admin is authenticated
	admin, exists := c.Get("currentAdminUser")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin authentication error"})
		return
	}
	adminUser := admin.(models.AdminUser)

	// Get report ID from URL parameter
	reportID := c.Param("id")

	// Validate report ID format
	reportObjID, err := primitive.ObjectIDFromHex(reportID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid report ID format"})
		return
	}

	// Verify report exists
	reportsColl := config.DB.Collection("audit_reports")
	var report models.AuditReport
	err = reportsColl.FindOne(context.TODO(), bson.M{"_id": reportObjID}).Decode(&report)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit report not found"})
		return
	}

	// Check if findings are submitted as an array
	var findingsArray []struct {
		Title          string `json:"title" binding:"required"`
		Severity       string `json:"severity" binding:"required"`
		Description    string `json:"description" binding:"required"`
		Recommendation string `json:"recommendation" binding:"required"`
	}

	if err := c.ShouldBindJSON(&findingsArray); err != nil {
		// If not an array, try binding a single finding
		var singleFinding struct {
			Title          string `json:"title" binding:"required"`
			Severity       string `json:"severity" binding:"required"`
			Description    string `json:"description" binding:"required"`
			Recommendation string `json:"recommendation" binding:"required"`
		}

		if err := c.ShouldBindJSON(&singleFinding); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
			return
		}

		// Convert single finding to array
		findingsArray = []struct {
			Title          string `json:"title" binding:"required"`
			Severity       string `json:"severity" binding:"required"`
			Description    string `json:"description" binding:"required"`
			Recommendation string `json:"recommendation" binding:"required"`
		}{singleFinding}
	}

	// Validate severity values
	validSeverities := map[string]bool{
		"critical": true,
		"high":     true,
		"medium":   true,
		"low":      true,
		"info":     true,
	}

	for _, finding := range findingsArray {
		if !validSeverities[finding.Severity] {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid severity level. Must be one of: critical, high, medium, low, info",
			})
			return
		}
	}

	// Create findings objects
	now := time.Now()
	var findings []interface{}

	for _, finding := range findingsArray {
		findings = append(findings, models.Finding{
			ReportID:       reportID,
			Title:          finding.Title,
			Severity:       finding.Severity,
			Description:    finding.Description,
			Recommendation: finding.Recommendation,
			CreatedAt:      now,
			UpdatedAt:      now,
		})
	}

	// Insert findings into database
	findingsColl := config.DB.Collection("findings")
	_, err = findingsColl.InsertMany(context.TODO(), findings)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add findings"})
		return
	}

	// Update findings count in report
	currentFindingsCount := report.FindingsCount
	newFindingsCount := currentFindingsCount + len(findingsArray)

	_, err = reportsColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": reportObjID},
		bson.M{
			"$set": bson.M{
				"findings_count": newFindingsCount,
				"updated_at":     now,
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update report"})
		return
	}

	// Add audit log entry
	log := models.AuditLog{
		ContractID: report.ContractID,
		Event:      "Added Findings",
		ActorID:    adminUser.ID.Hex(),
		ActorRole:  adminUser.Role,
		CreatedAt:  now,
	}

	logsColl := config.DB.Collection("audit_logs")
	logsColl.InsertOne(context.TODO(), log)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Findings added successfully",
		"count":   len(findingsArray),
		"total":   newFindingsCount,
	})
}

// UpdateContractStatus updates the status of a contract
func UpdateContractStatus(c *gin.Context) {
	// Verify admin is authenticated
	admin, exists := c.Get("currentAdminUser")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin authentication error"})
		return
	}
	adminUser := admin.(models.AdminUser)

	// Get contract ID from URL parameter
	contractID := c.Param("id")

	// Validate contract ID format
	contractObjID, err := primitive.ObjectIDFromHex(contractID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contract ID format"})
		return
	}

	// Parse request body
	var req struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Validate status value
	validStatuses := map[string]bool{
		"pending":     true,
		"in_progress": true,
		"completed":   true,
		"failed":      true,
	}

	if !validStatuses[req.Status] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid status. Must be one of: pending, in_progress, completed, failed",
		})
		return
	}

	// Verify contract exists
	contractsColl := config.DB.Collection("contracts")
	var contract models.Contract
	err = contractsColl.FindOne(context.TODO(), bson.M{"_id": contractObjID}).Decode(&contract)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	// Prevent changing completed status back to in_progress
	if contract.Status == "completed" && req.Status == "in_progress" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot change status from completed to in_progress"})
		return
	}

	// Update contract status
	now := time.Now()
	_, err = contractsColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": contractObjID},
		bson.M{
			"$set": bson.M{
				"status":     req.Status,
				"updated_at": now,
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contract status"})
		return
	}

	// Create audit log entry
	log := models.AuditLog{
		ContractID: contractID,
		Event:      "Status Changed to " + req.Status,
		ActorID:    adminUser.ID.Hex(),
		ActorRole:  adminUser.Role,
		CreatedAt:  now,
	}

	logsColl := config.DB.Collection("audit_logs")
	logsColl.InsertOne(context.TODO(), log)

	// Create user notification for status change
	if req.Status == "in_progress" || req.Status == "completed" || req.Status == "failed" {
		notification := models.Notification{
			UserID:    contract.UserID,
			Title:     "Contract Status Updated",
			Body:      "Your contract " + contract.Name + " status has been updated to " + req.Status,
			IsRead:    false,
			CreatedAt: now,
			UpdatedAt: now,
		}

		notificationsColl := config.DB.Collection("notifications")
		notificationsColl.InsertOne(context.TODO(), notification)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Contract status updated successfully",
		"status":  req.Status,
	})
}
