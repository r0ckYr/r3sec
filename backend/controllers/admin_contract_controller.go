// ./controllers/admin_contract_controller.go
package controllers

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"r3sec/config"
	"r3sec/models"
)

// AdminListContracts retrieves all contracts in the system
func AdminListContracts(c *gin.Context) {
	// Verify admin is authenticated
	_, exists := c.Get("currentAdminUser")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin authentication error"})
		return
	}
	status := c.Query("status")
	userID := c.Query("user_id")

	// Build query filter
	filter := bson.M{}

	// Add status filter if provided
	if status != "" {
		filter["status"] = status
	}

	// Add user filter if provided
	if userID != "" {
		filter["user_id"] = userID
	}

	page := 1
	limit := 20

	if pageStr := c.Query("page"); pageStr != "" {
		if parsedPage, err := strconv.Atoi(pageStr); err == nil && parsedPage > 0 {
			page = parsedPage
		}
	}

	if limitStr := c.Query("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 && parsedLimit <= 100 {
			limit = parsedLimit
		}
	}

	opts := options.Find()
	opts.SetSort(bson.M{"created_at": -1}) // Sort by creation date, newest first
	opts.SetSkip(int64((page - 1) * limit))
	opts.SetLimit(int64(limit))

	contractsColl := config.DB.Collection("contracts")
	cursor, err := contractsColl.Find(context.TODO(), filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contracts"})
		return
	}
	defer cursor.Close(context.TODO())

	var contracts []models.Contract
	if err = cursor.All(context.TODO(), &contracts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode contracts"})
		return
	}

	total, err := contractsColl.CountDocuments(context.TODO(), filter)
	if err != nil {
		total = int64(len(contracts)) // Fallback if count fails
	}

	userColl := config.DB.Collection("users")
	var contractsWithUser []gin.H

	for _, contract := range contracts {
		var user models.User
		userObjID, err := primitive.ObjectIDFromHex(contract.UserID)

		if err == nil {
			_ = userColl.FindOne(context.TODO(), bson.M{"_id": userObjID}).Decode(&user)
		}

		var auditReport models.AuditReport
		hasReport := false

		reportsColl := config.DB.Collection("audit_reports")
		err = reportsColl.FindOne(context.TODO(), bson.M{"contract_id": contract.ID}).Decode(&auditReport)
		if err == nil {
			hasReport = true
		}

		contractsWithUser = append(contractsWithUser, gin.H{
			"contract":   contract,
			"user_email": user.Email,
			"has_report": hasReport,
			"report_id":  auditReport.ID,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"contracts": contractsWithUser,
		"pagination": gin.H{
			"total": total,
			"page":  page,
			"limit": limit,
			"pages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

func AdminGetContract(c *gin.Context) {
	_, exists := c.Get("currentAdminUser")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin authentication error"})
		return
	}

	contractID := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(contractID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contract ID format"})
		return
	}

	contractsColl := config.DB.Collection("contracts")
	var contract models.Contract
	err = contractsColl.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	userColl := config.DB.Collection("users")
	var user models.User
	userObjID, err := primitive.ObjectIDFromHex(contract.UserID)

	if err == nil {
		_ = userColl.FindOne(context.TODO(), bson.M{"_id": userObjID}).Decode(&user)
	}

	reportsColl := config.DB.Collection("audit_reports")
	var auditReport models.AuditReport
	hasReport := false

	err = reportsColl.FindOne(context.TODO(), bson.M{"contract_id": contractID}).Decode(&auditReport)
	if err == nil {
		hasReport = true

		findingsColl := config.DB.Collection("findings")
		findingsCursor, err := findingsColl.Find(
			context.TODO(),
			bson.M{"report_id": auditReport.ID},
			options.Find().SetSort(bson.M{"severity": 1}),
		)

		if err == nil {
			var findings []models.Finding
			_ = findingsCursor.All(context.TODO(), &findings)

		}
	}

	logsColl := config.DB.Collection("audit_logs")
	logsCursor, err := logsColl.Find(
		context.TODO(),
		bson.M{"contract_id": contractID},
		options.Find().SetSort(bson.M{"created_at": -1}),
	)

	var logs []models.AuditLog
	if err == nil {
		_ = logsCursor.All(context.TODO(), &logs)
	}

	var findings []models.Finding
	if hasReport {
		findingsColl := config.DB.Collection("findings")
		findingsCursor, err := findingsColl.Find(
			context.TODO(),
			bson.M{"report_id": auditReport.ID},
			options.Find().SetSort(bson.M{"severity": 1}),
		)

		if err == nil {
			_ = findingsCursor.All(context.TODO(), &findings)
		}
	}

	result := gin.H{
		"contract":   contract,
		"user":       user,
		"audit_logs": logs,
	}

	if hasReport {
		result["audit_report"] = auditReport
		result["findings"] = findings
	}

	c.JSON(http.StatusOK, result)
}
