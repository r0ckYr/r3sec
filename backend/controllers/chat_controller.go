package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"r3sec/config"
	"r3sec/models"
)

// GetContractMessages retrieves all messages for a specific contract (for users)
func GetContractMessages(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	contractID := c.Param("id")

	// Verify the contract belongs to this user
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

	messages := []models.Message{}

	if err = cursor.All(context.TODO(), &messages); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode messages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"messages": messages})
}

// SendMessage allows a user to send a message for a specific contract
func SendMessage(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	contractID := c.Param("id")

	// Verify the contract belongs to this user
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

	var req struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	message := models.Message{
		ID:         primitive.NewObjectID(),
		ContractID: contractID,
		SenderID:   user.ID.Hex(),
		SenderRole: "user",
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

	c.JSON(http.StatusCreated, gin.H{
		"message": "Message sent successfully",
		"data":    message,
	})
}

func MarkMessageRead(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	messageID := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(messageID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID format"})
		return
	}

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
			"user_id":    user.ID.Hex(),
			"is_deleted": false,
		},
	).Decode(&contract)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to access this message"})
		return
	}

	if message.SenderRole != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can only mark received messages as read"})
		return
	}

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

func GetUserUnreadMessageCount(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)

	contractsColl := config.DB.Collection("contracts")
	cursor, err := contractsColl.Find(
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
	defer cursor.Close(context.TODO())

	var contracts []models.Contract
	if err = cursor.All(context.TODO(), &contracts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode contracts"})
		return
	}

	var contractIDs []string
	for _, contract := range contracts {
		contractIDs = append(contractIDs, contract.ID)
	}

	messagesColl := config.DB.Collection("messages")
	count, err := messagesColl.CountDocuments(
		context.TODO(),
		bson.M{
			"contract_id": bson.M{"$in": contractIDs},
			"sender_role": "admin", // Only count messages from admin
			"is_read":     false,
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count unread messages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"unread_count": count})
}

// GetContractsWithUnreadMessages returns all contracts with a flag indicating if they have unread messages
func GetContractsWithUnreadMessages(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)

	// Get all user's contracts
	contractsColl := config.DB.Collection("contracts")
	cursor, err := contractsColl.Find(
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
	defer cursor.Close(context.TODO())

	var contracts []models.Contract
	if err = cursor.All(context.TODO(), &contracts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode contracts"})
		return
	}

	// For each contract, check if there are unread messages
	messagesColl := config.DB.Collection("messages")
	
	// Prepare the response structure
	type ContractUnreadStatus struct {
		ContractID      string `json:"contract_id"`
		ContractName    string `json:"contract_name"`
		HasUnread       bool   `json:"has_unread"`
		UnreadCount     int64  `json:"unread_count"`
	}

	var result []ContractUnreadStatus

	for _, contract := range contracts {
		// Count unread messages for this contract
		count, err := messagesColl.CountDocuments(
			context.TODO(),
			bson.M{
				"contract_id": contract.ID,
				"sender_role": "admin", // Only count messages from admin
				"is_read":     false,
			},
		)

		if err != nil {
			continue
		}

		result = append(result, ContractUnreadStatus{
			ContractID:   contract.ID,
			ContractName: contract.Name,
			HasUnread:    count > 0,
			UnreadCount:  count,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"contracts": result,
	})
}
