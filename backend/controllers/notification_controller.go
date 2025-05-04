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

// ListNotifications retrieves all notifications for the current user
func ListNotifications(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)

	notificationsColl := config.DB.Collection("notifications")

	// Set up query options
	opts := options.Find().SetSort(bson.M{"created_at": -1}) // Newest first

	// Fixed pagination code
	page := 1
	limit := 20

	if pageParam := c.Query("page"); pageParam != "" {
		if parsedPage, err := strconv.Atoi(pageParam); err == nil && parsedPage > 0 {
			page = parsedPage
		}
	}

	if limitParam := c.Query("limit"); limitParam != "" {
		if parsedLimit, err := strconv.Atoi(limitParam); err == nil && parsedLimit > 0 && parsedLimit <= 100 {
			limit = parsedLimit
		}
	}

	// Apply pagination
	opts.SetSkip(int64((page - 1) * limit))
	opts.SetLimit(int64(limit))

	// Get all notifications for the user
	cursor, err := notificationsColl.Find(
		context.TODO(),
		bson.M{"user_id": user.ID.Hex()},
		opts,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve notifications"})
		return
	}
	defer cursor.Close(context.TODO())

	var notifications []models.Notification
	if err = cursor.All(context.TODO(), &notifications); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode notifications"})
		return
	}

	// Count total unread notifications
	unreadCount, err := notificationsColl.CountDocuments(
		context.TODO(),
		bson.M{
			"user_id": user.ID.Hex(),
			"is_read": false,
		},
	)

	if err != nil {
		unreadCount = 0 // Default to 0 if error
	}

	c.JSON(http.StatusOK, gin.H{
		"notifications": notifications,
		"unread_count":  unreadCount,
		"page":          page,
		"limit":         limit,
	})
}

// MarkNotificationRead marks a notification as read
func MarkNotificationRead(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	notificationID := c.Param("id")

	// Validate notification ID format
	objID, err := primitive.ObjectIDFromHex(notificationID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notification ID format"})
		return
	}

	// Find the notification and verify ownership
	notificationsColl := config.DB.Collection("notifications")
	var notification models.Notification
	err = notificationsColl.FindOne(
		context.TODO(),
		bson.M{
			"_id":     objID,
			"user_id": user.ID.Hex(),
		},
	).Decode(&notification)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notification not found"})
		return
	}

	// If already read, return success
	if notification.IsRead {
		c.JSON(http.StatusOK, gin.H{"message": "Notification already marked as read"})
		return
	}

	// Update to mark as read
	_, err = notificationsColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{
			"$set": bson.M{
				"is_read":    true,
				"updated_at": time.Now(),
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark notification as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification marked as read"})
}
