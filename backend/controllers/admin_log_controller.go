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

// AdminListLogs retrieves all audit logs in the system
func AdminListLogs(c *gin.Context) {
	// Verify admin is authenticated
	_, exists := c.Get("currentAdminUser")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin authentication error"})
		return
	}

	// Get pagination parameters
	page := 1
	limit := 50 // Higher limit for logs

	if pageStr := c.Query("page"); pageStr != "" {
		if parsedPage, err := strconv.Atoi(pageStr); err == nil && parsedPage > 0 {
			page = parsedPage
		}
	}

	if limitStr := c.Query("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 && parsedLimit <= 200 {
			limit = parsedLimit
		}
	}

	// Set up filtering options
	filter := bson.M{}

	// Filter by event type if provided
	if eventType := c.Query("event"); eventType != "" {
		filter["event"] = eventType
	}

	// Filter by actor role if provided
	if actorRole := c.Query("actor_role"); actorRole != "" {
		filter["actor_role"] = actorRole
	}

	// Set up options for pagination and sorting
	opts := options.Find()
	opts.SetSort(bson.M{"created_at": -1}) // Most recent first
	opts.SetSkip(int64((page - 1) * limit))
	opts.SetLimit(int64(limit))

	// Query the audit logs collection
	logsColl := config.DB.Collection("audit_logs")
	cursor, err := logsColl.Find(context.TODO(), filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audit logs"})
		return
	}
	defer cursor.Close(context.TODO())

	// Decode results
	var logs []models.AuditLog
	if err = cursor.All(context.TODO(), &logs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode audit logs"})
		return
	}

	// Count total logs for pagination info
	total, err := logsColl.CountDocuments(context.TODO(), filter)
	if err != nil {
		total = int64(len(logs)) // Fallback if count fails
	}

	// Enrich logs with additional information about actors and contracts
	var enrichedLogs []gin.H
	userColl := config.DB.Collection("users")
	adminColl := config.DB.Collection("admin_users")
	contractColl := config.DB.Collection("contracts")

	for _, log := range logs {
		enrichedLog := gin.H{
			"id":         log.ID,
			"event":      log.Event,
			"actor_role": log.ActorRole,
			"created_at": log.CreatedAt,
		}

		// Add contract info if available
		if log.ContractID != "" {
			contractObjID, err := primitive.ObjectIDFromHex(log.ContractID)
			if err == nil {
				var contract models.Contract
				err = contractColl.FindOne(context.TODO(), bson.M{"_id": contractObjID}).Decode(&contract)
				if err == nil {
					enrichedLog["contract"] = gin.H{
						"id":   contract.ID,
						"name": contract.Name,
					}
				}
			}
		}

		// Add actor info if available
		if log.ActorID != "" {
			if log.ActorRole == "user" {
				// Get regular user info
				userObjID, err := primitive.ObjectIDFromHex(log.ActorID)
				if err == nil {
					var user models.User
					err = userColl.FindOne(context.TODO(), bson.M{"_id": userObjID}).Decode(&user)
					if err == nil {
						enrichedLog["actor"] = gin.H{
							"id":    user.ID.Hex(),
							"email": user.Email,
						}
					}
				}
			} else if log.ActorRole == "admin" || log.ActorRole == "auditor" {
				// Get admin user info
				adminObjID, err := primitive.ObjectIDFromHex(log.ActorID)
				if err == nil {
					var adminUser models.AdminUser
					err = adminColl.FindOne(context.TODO(), bson.M{"_id": adminObjID}).Decode(&adminUser)
					if err == nil {
						enrichedLog["actor"] = gin.H{
							"id":    adminUser.ID.Hex(),
							"email": adminUser.Email,
							"role":  adminUser.Role,
						}
					}
				}
			}
		}

		enrichedLogs = append(enrichedLogs, enrichedLog)
	}

	// Log admin action

	// Return paginated results
	c.JSON(http.StatusOK, gin.H{
		"logs": enrichedLogs,
		"pagination": gin.H{
			"total": total,
			"page":  page,
			"limit": limit,
			"pages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// AdminGetContractLogs retrieves audit logs for a specific contract
func AdminGetContractLogs(c *gin.Context) {
	// Verify admin is authenticated
	_, exists := c.Get("currentAdminUser")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin authentication error"})
		return
	}

	// Get contract ID from URL parameter
	contractID := c.Param("id")

	// Validate ID format
	_, err := primitive.ObjectIDFromHex(contractID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contract ID format"})
		return
	}

	// Get pagination parameters
	page := 1
	limit := 50 // Higher limit for logs

	if pageStr := c.Query("page"); pageStr != "" {
		if parsedPage, err := strconv.Atoi(pageStr); err == nil && parsedPage > 0 {
			page = parsedPage
		}
	}

	if limitStr := c.Query("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 && parsedLimit <= 200 {
			limit = parsedLimit
		}
	}

	// Set up filter for this specific contract
	filter := bson.M{"contract_id": contractID}

	// Filter by event type if provided
	if eventType := c.Query("event"); eventType != "" {
		filter["event"] = eventType
	}

	// Set up options for pagination and sorting
	opts := options.Find()
	opts.SetSort(bson.M{"created_at": -1}) // Most recent first
	opts.SetSkip(int64((page - 1) * limit))
	opts.SetLimit(int64(limit))

	// Query the audit logs collection
	logsColl := config.DB.Collection("audit_logs")
	cursor, err := logsColl.Find(context.TODO(), filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audit logs"})
		return
	}
	defer cursor.Close(context.TODO())

	// Decode results
	var logs []models.AuditLog
	if err = cursor.All(context.TODO(), &logs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode audit logs"})
		return
	}

	// Count total logs for pagination info
	total, err := logsColl.CountDocuments(context.TODO(), filter)
	if err != nil {
		total = int64(len(logs)) // Fallback if count fails
	}

	// Get contract details
	contractColl := config.DB.Collection("contracts")
	var contract models.Contract
	contractObjID, _ := primitive.ObjectIDFromHex(contractID)
	err = contractColl.FindOne(context.TODO(), bson.M{"_id": contractObjID}).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	// Enrich logs with actor information
	var enrichedLogs []gin.H
	userColl := config.DB.Collection("users")
	adminColl := config.DB.Collection("admin_users")

	for _, log := range logs {
		enrichedLog := gin.H{
			"id":         log.ID,
			"event":      log.Event,
			"actor_role": log.ActorRole,
			"created_at": log.CreatedAt,
		}

		// Add actor info if available
		if log.ActorID != "" {
			if log.ActorRole == "user" {
				// Get regular user info
				userObjID, err := primitive.ObjectIDFromHex(log.ActorID)
				if err == nil {
					var user models.User
					err = userColl.FindOne(context.TODO(), bson.M{"_id": userObjID}).Decode(&user)
					if err == nil {
						enrichedLog["actor"] = gin.H{
							"id":    user.ID.Hex(),
							"email": user.Email,
						}
					}
				}
			} else if log.ActorRole == "admin" || log.ActorRole == "auditor" {
				// Get admin user info
				adminObjID, err := primitive.ObjectIDFromHex(log.ActorID)
				if err == nil {
					var adminUser models.AdminUser
					err = adminColl.FindOne(context.TODO(), bson.M{"_id": adminObjID}).Decode(&adminUser)
					if err == nil {
						enrichedLog["actor"] = gin.H{
							"id":    adminUser.ID.Hex(),
							"email": adminUser.Email,
							"role":  adminUser.Role,
						}
					}
				}
			}
		}

		enrichedLogs = append(enrichedLogs, enrichedLog)
	}

	// Get contract user info
	var user models.User
	userObjID, err := primitive.ObjectIDFromHex(contract.UserID)
	if err == nil {
		_ = userColl.FindOne(context.TODO(), bson.M{"_id": userObjID}).Decode(&user)
	}

	// Log admin action

	// Return logs and contract details
	c.JSON(http.StatusOK, gin.H{
		"contract": gin.H{
			"id":          contract.ID,
			"name":        contract.Name,
			"status":      contract.Status,
			"upload_type": contract.UploadType,
			"created_at":  contract.CreatedAt,
			"user": gin.H{
				"id":    user.ID.Hex(),
				"email": user.Email,
			},
		},
		"logs": enrichedLogs,
		"pagination": gin.H{
			"total": total,
			"page":  page,
			"limit": limit,
			"pages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}
