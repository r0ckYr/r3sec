package controllers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"r3sec/config"
	"r3sec/models"
)

// ListFindingsByReport retrieves all findings for a specific audit report
func ListFindingsByReport(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	reportID := c.Param("id")

	// Validate report ID format
	reportObjID, err := primitive.ObjectIDFromHex(reportID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid report ID format"})
		return
	}

	// Get the report to verify ownership
	reportsColl := config.DB.Collection("audit_reports")
	var report models.AuditReport
	err = reportsColl.FindOne(context.TODO(), bson.M{"_id": reportObjID}).Decode(&report)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit report not found"})
		return
	}

	// Get contract to verify ownership
	contractsColl := config.DB.Collection("contracts")
	var contract models.Contract

	contractObjID, err := primitive.ObjectIDFromHex(report.ContractID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid contract reference"})
		return
	}

	err = contractsColl.FindOne(
		context.TODO(),
		bson.M{
			"_id":     contractObjID,
			"user_id": user.ID.Hex(),
		},
	).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have access to this report"})
		return
	}

	// Get all findings for the report
	findingsColl := config.DB.Collection("findings")
	opts := options.Find().SetSort(bson.M{"severity": 1}) // Sort by severity

	cursor, err := findingsColl.Find(
		context.TODO(),
		bson.M{"report_id": reportID},
		opts,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve findings"})
		return
	}
	defer cursor.Close(context.TODO())

	var findings []models.Finding
	if err = cursor.All(context.TODO(), &findings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode findings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"findings": findings,
		"report":   report,
	})
}

// GetFinding retrieves a specific finding by ID
func GetFinding(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	findingID := c.Param("id")

	// Validate finding ID format
	objID, err := primitive.ObjectIDFromHex(findingID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid finding ID format"})
		return
	}

	// Get the finding
	findingsColl := config.DB.Collection("findings")
	var finding models.Finding
	err = findingsColl.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&finding)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Finding not found"})
		return
	}

	// Get the report to verify ownership
	reportsColl := config.DB.Collection("audit_reports")
	var report models.AuditReport

	reportObjID, err := primitive.ObjectIDFromHex(finding.ReportID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid report reference"})
		return
	}

	err = reportsColl.FindOne(context.TODO(), bson.M{"_id": reportObjID}).Decode(&report)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Associated report not found"})
		return
	}

	// Get contract to verify ownership
	contractsColl := config.DB.Collection("contracts")
	var contract models.Contract

	contractObjID, err := primitive.ObjectIDFromHex(report.ContractID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid contract reference"})
		return
	}

	err = contractsColl.FindOne(
		context.TODO(),
		bson.M{
			"_id":     contractObjID,
			"user_id": user.ID.Hex(),
		},
	).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have access to this finding"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"finding":  finding,
		"report":   report,
		"contract": contract,
	})
}
