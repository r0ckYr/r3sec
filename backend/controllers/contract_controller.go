package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"r3sec/config"
	"r3sec/models"
)

func ListContracts(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)

	contractsColl := config.DB.Collection("contracts")

	findOptions := options.Find()
	findOptions.SetSort(bson.M{"created_at": -1})

	cursor, err := contractsColl.Find(
		context.TODO(),
		bson.M{
			"user_id":    user.ID.Hex(),
			"is_deleted": false,
		},
		findOptions,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve contracts"})
		return
	}
	defer cursor.Close(context.TODO())

	var contracts []models.Contract
	if err = cursor.All(context.TODO(), &contracts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode contracts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"contracts": contracts})
}

func CreateContract(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	var req struct {
		Name        string `json:"name" binding:"required"`
		UploadType  string `json:"upload_type" binding:"required"`
		Description string `json:"description"`
		UploadURL   string `json:"upload_url" binding:"required"`
		PaymentID   string `json:"payment_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	if !isValidUploadType(req.UploadType) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid upload type"})
		return
	}
	if !validateUploadURL(req.UploadType, req.UploadURL) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL or contract address format"})
		return
	}

	// Default payment values
	planID := ""
	paymentStatus := "no_payment"

	// Check if payment ID exists and is valid
	if req.PaymentID != "" {
		// Try to convert the string to ObjectID to check validity
		paymentObjID, err := primitive.ObjectIDFromHex(req.PaymentID)
		if err == nil {
			// Valid ObjectID, fetch payment details
			paymentsColl := config.DB.Collection("payments")
			var payment models.Payment
			err = paymentsColl.FindOne(context.TODO(), bson.M{"_id": paymentObjID}).Decode(&payment)
			if err == nil {
				// Set payment details if found
				planID = payment.PlanID
				paymentStatus = payment.Status
			}
		}
	}

	contract := models.Contract{
		UserID:        user.ID.Hex(),
		Name:          req.Name,
		Description:   req.Description,
		UploadType:    req.UploadType,
		UploadURL:     req.UploadURL,
		Status:        "pending",
		PaymentID:     req.PaymentID,
		PlanID:        planID,
		PaymentStatus: paymentStatus,
		IsDeleted:     false,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	contractsColl := config.DB.Collection("contracts")
	result, err := contractsColl.InsertOne(context.TODO(), contract)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create contract"})
		return
	}
	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		contract.ID = oid.Hex()
	}

	logContract(user.ID.Hex(), contract.ID, "Uploaded", "user")
	c.JSON(http.StatusCreated, gin.H{
		"message":  "Contract created successfully",
		"contract": contract,
	})
}

func GetContract(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	contractID := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(contractID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contract ID format"})
		return
	}

	var contract models.Contract
	contractsColl := config.DB.Collection("contracts")
	err = contractsColl.FindOne(
		context.TODO(),
		bson.M{
			"_id":        objID,
			"user_id":    user.ID.Hex(),
			"is_deleted": false,
		},
	).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	// Always fetch audit logs
	auditLogsColl := config.DB.Collection("audit_logs")
	logsCursor, err := auditLogsColl.Find(
		context.TODO(),
		bson.M{"contract_id": contract.ID},
	)

	var auditLogs []models.AuditLog
	if err == nil {
		defer logsCursor.Close(context.TODO())
		logsCursor.All(context.TODO(), &auditLogs)
	}

	// Try fetching audit report
	var auditReport models.AuditReport
	reportsColl := config.DB.Collection("audit_reports")
	err = reportsColl.FindOne(
		context.TODO(),
		bson.M{"contract_id": contract.ID},
	).Decode(&auditReport)

	if err == nil {
		findingsColl := config.DB.Collection("findings")
		findingsCursor, err := findingsColl.Find(
			context.TODO(),
			bson.M{"report_id": auditReport.ID},
		)

		var findings []models.Finding
		if err == nil {
			defer findingsCursor.Close(context.TODO())
			findingsCursor.All(context.TODO(), &findings)
		}

		c.JSON(http.StatusOK, gin.H{
			"contract":     contract,
			"audit_report": auditReport,
			"findings":     findings,
			"audit_logs":   auditLogs,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"contract":   contract,
		"audit_logs": auditLogs,
	})
}

func DeleteContract(c *gin.Context) {
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
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	_, err = contractsColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{
			"$set": bson.M{
				"is_deleted": true,
				"updated_at": time.Now(),
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contract"})
		return
	}

	logContract(user.ID.Hex(), contract.ID, "Deleted", "user")

	c.JSON(http.StatusOK, gin.H{"message": "Contract deleted successfully"})
}

func ResubmitContract(c *gin.Context) {
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
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	fiveMinutesAgo := time.Now().Add(-5 * time.Minute)
	if contract.CreatedAt.Before(fiveMinutesAgo) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Contracts can only be resubmitted within 5 minutes of creation",
		})
		return
	}

	var req struct {
		Name        string `json:"name"`
		UploadType  string `json:"upload_type"`
		UploadURL   string `json:"upload_url"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if req.UploadURL == "" && req.Description == "" && req.Name == "" && req.UploadType == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "At least one field (upload_url, description, name, or upload_type) must be provided",
		})
		return
	}

	updateDoc := bson.M{"updated_at": time.Now()}

	// Handle upload type validation first
	uploadType := contract.UploadType
	if req.UploadType != "" {
		// Use the same validation function as in CreateContract
		if !isValidUploadType(req.UploadType) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid upload type"})
			return
		}
		uploadType = req.UploadType
		updateDoc["upload_type"] = req.UploadType
	}

	// Now validate upload URL if provided
	if req.UploadURL != "" {
		if !validateUploadURL(uploadType, req.UploadURL) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL format for the upload type"})
			return
		}
		updateDoc["upload_url"] = req.UploadURL
	}

	if req.Description != "" {
		updateDoc["description"] = req.Description
	}

	if req.Name != "" {
		updateDoc["name"] = req.Name
	}

	updateDoc["status"] = "pending"

	_, err = contractsColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$set": updateDoc},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contract"})
		return
	}

	logContract(user.ID.Hex(), contractID, "Resubmitted", "user")

	var updatedContract models.Contract
	err = contractsColl.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&updatedContract)

	c.JSON(http.StatusOK, gin.H{
		"message":  "Contract resubmitted successfully",
		"contract": updatedContract,
	})
}

func isValidUploadType(uploadType string) bool {
	validTypes := map[string]bool{
		"github":       true,
		"program_id":   true,
		"google_drive": true,
		"gitlab":       true,
		"bitbucket":    true,
		"ipfs":         true,
	}
	return validTypes[uploadType]
}

func validateUploadURL(uploadType, url string) bool {
	url = strings.TrimSpace(url)
	if url == "" {
		return false
	}

	switch uploadType {
	case "github":
		return strings.HasPrefix(url, "https://github.com/")
	case "google_drive":
		return strings.HasPrefix(url, "https://drive.google.com/") ||
			strings.HasPrefix(url, "https://docs.google.com/")
	case "gitlab":
		return strings.HasPrefix(url, "https://gitlab.com/")
	case "bitbucket":
		return strings.HasPrefix(url, "https://bitbucket.org/")
	case "ipfs":
		return strings.HasPrefix(url, "ipfs://") ||
			strings.HasPrefix(url, "https://ipfs.io/ipfs/")
	case "program_id":
		return len(url) >= 32 && len(url) <= 44
	default:
		return false
	}
}

func logContract(userID, contractID, event, role string) {
	auditLog := models.AuditLog{
		ContractID: contractID,
		Event:      event,
		ActorID:    userID,
		ActorRole:  role,
		CreatedAt:  time.Now(),
	}

	logsColl := config.DB.Collection("audit_logs")
	logsColl.InsertOne(context.TODO(), auditLog)
}
