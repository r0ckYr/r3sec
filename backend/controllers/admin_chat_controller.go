package controllers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"r3sec/config"
	"r3sec/models"
)

// AdminGetContractMessages retrieves all messages for a specific contract (for admins)
func AdminGetContractMessages(c *gin.Context) {
	contractID := c.Param("id")

	// Verify the contract exists
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
			"is_deleted": false,
		},
	).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	// Get messages
	messagesColl := config.DB.Collection("messages")
	findOptions := options.Find()
	findOptions.SetSort(bson.M{"created_at": 1}) // Sort by time ascending

	cursor, err := messagesColl.Find(
		context.TODO(),
		bson.M{"contract_id": contractID},
		findOptions,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve messages"})
		return
	}
	defer cursor.Close(context.TODO())

	var messages []models.Message
	if err = cursor.All(context.TODO(), &messages); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode messages"})
		return
	}

	// Get the user details for context
	var user models.User
	userID, _ := primitive.ObjectIDFromHex(contract.UserID)
	usersColl := config.DB.Collection("users")
	usersColl.FindOne(context.TODO(), bson.M{"_id": userID}).Decode(&user)

	c.JSON(http.StatusOK, gin.H{
		"messages": messages,
		"contract": contract,
		"user": gin.H{
			"id":    user.ID,
			"email": user.Email,
		},
	})
}

// AdminSendMessage allows an admin to send a message for a specific contract
func AdminSendMessage(c *gin.Context) {
	admin := c.MustGet("currentAdminUser").(models.AdminUser)
	contractID := c.Param("id")

	// Verify the contract exists
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
			"is_deleted": false,
		},
	).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	// Get the message content
	var req struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Create the message
	message := models.Message{
		ID:         primitive.NewObjectID(),
		ContractID: contractID,
		SenderID:   admin.ID.Hex(),
		SenderRole: "admin",
		Content:    req.Content,
		IsRead:     false,
		CreatedAt:  time.Now(),
	}

	messagesColl := config.DB.Collection("messages")
	_, err = messagesColl.InsertOne(context.TODO(), message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	// Create a notification for the user
	createUserNotification(contract.UserID, "New message for contract "+contract.Name,
		"You have received a new message regarding your contract "+contract.Name)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Message sent successfully",
		"data":    message,
	})
}

// AdminMarkMessageRead allows an admin to mark a message as read
func AdminMarkMessageRead(c *gin.Context) {
	messageID := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(messageID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID format"})
		return
	}

	// Verify the message exists
	messagesColl := config.DB.Collection("messages")
	var message models.Message
	err = messagesColl.FindOne(
		context.TODO(),
		bson.M{"_id": objID},
	).Decode(&message)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
		return
	}

	// Verify the contract exists
	contractID, err := primitive.ObjectIDFromHex(message.ContractID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid contract ID in message"})
		return
	}

	contractsColl := config.DB.Collection("contracts")
	var contract models.Contract
	err = contractsColl.FindOne(
		context.TODO(),
		bson.M{
			"_id":        contractID,
			"is_deleted": false,
		},
	).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	// Only allow admins to mark user messages as read
	if message.SenderRole != "user" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can only mark user messages as read"})
		return
	}

	// Update the message
	_, err = messagesColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$set": bson.M{"is_read": true}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark message as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message marked as read"})
}

// Helper function to create notification for a user
func createUserNotification(userID, title, body string) {
	notification := models.Notification{
		UserID:    userID,
		Title:     title,
		Body:      body,
		IsRead:    false,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	notificationsColl := config.DB.Collection("notifications")
	notificationsColl.InsertOne(context.TODO(), notification)
}

func AdminGetUnreadMessagesSummary(c *gin.Context) {
	contractsColl := config.DB.Collection("contracts")
	messagesColl := config.DB.Collection("messages")

	// Parse pagination params
	limit := 20
	skip := 0

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}
	if s := c.Query("skip"); s != "" {
		if parsed, err := strconv.Atoi(s); err == nil && parsed >= 0 {
			skip = parsed
		}
	}

	// Optional filters
	filter := bson.M{"is_deleted": false}
	if name := c.Query("name"); name != "" {
		filter["name"] = bson.M{"$regex": name, "$options": "i"}
	}

	findOptions := options.Find().SetLimit(int64(limit)).SetSkip(int64(skip))

	// Fetch contracts
	cursor, err := contractsColl.Find(context.TODO(), filter, findOptions)
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

	var response []gin.H

	for _, contract := range contracts {
		count, err := messagesColl.CountDocuments(context.TODO(), bson.M{
			"contract_id": contract.ID,
			"sender_role": "user",
			"is_read":     false,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count messages"})
			return
		}

		response = append(response, gin.H{
			"contract_id":   contract.ID,
			"contract_name": contract.Name,
			"has_unread":    count > 0,
			"unread_count":  count,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"contracts": response,
		"pagination": gin.H{
			"limit": limit,
			"skip":  skip,
		},
	})
}
