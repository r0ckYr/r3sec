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

func ListAuditReports(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)

	contractsColl := config.DB.Collection("contracts")
	contractCursor, err := contractsColl.Find(
		context.TODO(),
		bson.M{
			"user_id":    user.ID.Hex(),
			"is_deleted": false,
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve contracts"})
		return
	}
	defer contractCursor.Close(context.TODO())

	var contracts []models.Contract
	if err = contractCursor.All(context.TODO(), &contracts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode contracts"})
		return
	}

	if len(contracts) == 0 {
		c.JSON(http.StatusOK, gin.H{"reports": []models.AuditReport{}})
		return
	}

	var contractIDs []string
	for _, contract := range contracts {
		contractIDs = append(contractIDs, contract.ID)
	}

	reportsColl := config.DB.Collection("audit_reports")
	opts := options.Find().SetSort(bson.M{"uploaded_at": -1}) // Newest first

	reportCursor, err := reportsColl.Find(
		context.TODO(),
		bson.M{"contract_id": bson.M{"$in": contractIDs}},
		opts,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve audit reports"})
		return
	}
	defer reportCursor.Close(context.TODO())

	var reports []models.AuditReport
	if err = reportCursor.All(context.TODO(), &reports); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode audit reports"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reports": reports})
}

func GetAuditReport(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	reportID := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(reportID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid report ID format"})
		return
	}

	reportsColl := config.DB.Collection("audit_reports")
	var report models.AuditReport
	err = reportsColl.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&report)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit report not found"})
		return
	}

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

	findingsColl := config.DB.Collection("findings")
	findingsCursor, err := findingsColl.Find(
		context.TODO(),
		bson.M{"report_id": report.ID},
		options.Find().SetSort(bson.M{"severity": 1}), // Sort by severity
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve findings"})
		return
	}
	defer findingsCursor.Close(context.TODO())

	var findings []models.Finding
	if err = findingsCursor.All(context.TODO(), &findings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode findings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"report":   report,
		"findings": findings,
		"contract": contract,
	})
}

func GetAuditReportByContract(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	contractID := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(contractID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contract ID format"})
		return
	}

	contractsColl := config.DB.Collection("contracts")
	var contract models.Contract
	err = contractsColl.FindOne(
		context.TODO(),
		bson.M{
			"_id":        objID,
			"user_id":    user.ID.Hex(),
			"is_deleted": false,
		},
	).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found or access denied"})
		return
	}

	reportsColl := config.DB.Collection("audit_reports")
	var report models.AuditReport
	err = reportsColl.FindOne(
		context.TODO(),
		bson.M{"contract_id": contractID},
	).Decode(&report)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No audit report found for this contract"})
		return
	}

	// Get findings for this report
	findingsColl := config.DB.Collection("findings")
	findingsCursor, err := findingsColl.Find(
		context.TODO(),
		bson.M{"report_id": report.ID},
		options.Find().SetSort(bson.M{"severity": 1}), // Sort by severity
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve findings"})
		return
	}
	defer findingsCursor.Close(context.TODO())

	var findings []models.Finding
	if err = findingsCursor.All(context.TODO(), &findings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode findings"})
		return
	}

	// Return the report with findings and contract info
	c.JSON(http.StatusOK, gin.H{
		"report":   report,
		"findings": findings,
		"contract": contract,
	})
}

// DownloadAuditReport provides a download link for the audit report
func DownloadAuditReport(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	reportID := c.Param("id")

	// Validate report ID format
	objID, err := primitive.ObjectIDFromHex(reportID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid report ID format"})
		return
	}

	// Get the report
	reportsColl := config.DB.Collection("audit_reports")
	var report models.AuditReport
	err = reportsColl.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&report)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audit report not found"})
		return
	}

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

	if report.ReportURL == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Report file not available"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"download_url": report.ReportURL,
		"filename":     "R3SEC_Audit_" + contract.Name + ".pdf",
	})
}
