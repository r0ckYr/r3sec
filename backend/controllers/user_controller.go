package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"

	"r3sec/config"
	"r3sec/models"
	"r3sec/utils"
)

func GetMe(c *gin.Context) {
	user, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get user from context"})
		return
	}

	currentUser := user.(models.User)
	c.JSON(http.StatusOK, gin.H{
		"id":                          currentUser.ID.Hex(),
		"email":                       currentUser.Email,
		"is_verified":                 currentUser.IsVerified,
		"is_deleted":                  currentUser.IsDeleted,
		"email_notifications_enabled": currentUser.EmailNotificationsEnabled,
		"created_at":                  currentUser.CreatedAt,
		"updated_at":                  currentUser.UpdatedAt,
	})
}

func GetUserByID(c *gin.Context) {
	idParam := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	userColl := config.DB.Collection("users")
	err = userColl.FindOne(context.TODO(), bson.M{"_id": objID, "is_deleted": false}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":          user.ID.Hex(),
		"email":       user.Email,
		"is_verified": user.IsVerified,
		"created_at":  user.CreatedAt,
	})
}

func UpdateUser(c *gin.Context) {
	idParam := c.Param("id")
	currentUser := c.MustGet("currentUser").(models.User)

	if currentUser.ID.Hex() != idParam {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to update this user"})
		return
	}

	var updateData struct {
		Email *string `json:"email,omitempty"`
	}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}

	update := bson.M{"updated_at": time.Now()}
	userColl := config.DB.Collection("users")

	if updateData.Email != nil {
		newEmail := strings.ToLower(strings.TrimSpace(*updateData.Email))

		if newEmail == currentUser.Email {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email is the same as current"})
			return
		}

		if !utils.IsValidEmail(newEmail) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
			return
		}

		var existing models.User
		err := userColl.FindOne(context.TODO(), bson.M{"email": newEmail}).Decode(&existing)
		if err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email is already in use"})
			return
		}

		update["email"] = newEmail
		update["is_verified"] = false

		_, err = userColl.UpdateOne(context.TODO(), bson.M{"_id": currentUser.ID}, bson.M{"$set": update})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
			return
		}

		token, err := utils.GenerateEmailToken(currentUser.ID.Hex(), newEmail)
		if err == nil {
			go utils.SendVerificationEmail(newEmail, token)
		}
	} else {
		_, err := userColl.UpdateOne(context.TODO(), bson.M{"_id": currentUser.ID}, bson.M{"$set": update})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated"})
}

func DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	currentUser := c.MustGet("currentUser").(models.User)

	if currentUser.ID.Hex() != idParam {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to delete this user"})
		return
	}

	userColl := config.DB.Collection("users")
	_, err := userColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": currentUser.ID},
		bson.M{"$set": bson.M{"is_deleted": true, "updated_at": time.Now()}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}

func ChangePassword(c *gin.Context) {
	idParam := c.Param("id")
	currentUser := c.MustGet("currentUser").(models.User)

	if currentUser.ID.Hex() != idParam {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to change this user's password"})
		return
	}

	var req struct {
		NewPassword string `json:"new_password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.NewPassword) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "New password is required"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	userColl := config.DB.Collection("users")
	_, err = userColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": currentUser.ID},
		bson.M{"$set": bson.M{
			"password_hash": string(hashedPassword),
			"updated_at":    time.Now(),
		}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}

func UpdateEmailNotifications(c *gin.Context) {
	currentUser := c.MustGet("currentUser").(models.User)

	var req struct {
		Enabled bool `json:"enabled"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	userColl := config.DB.Collection("users")
	_, err := userColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": currentUser.ID},
		bson.M{
			"$set": bson.M{
				"email_notifications_enabled": req.Enabled,
				"updated_at":                  time.Now(),
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update notification setting"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email notification preference updated"})
}
