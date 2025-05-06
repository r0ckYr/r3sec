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
)

func CreateAdminUser(c *gin.Context) {
	currentAdmin := c.MustGet("currentAdminUser").(models.AdminUser)

	if currentAdmin.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can create new admin users"})
		return
	}

	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=8"`
		Role     string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	req.Role = strings.ToLower(req.Role)
	if req.Role != "admin" && req.Role != "auditor" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Role must be either 'admin' or 'auditor'"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))

	adminColl := config.DB.Collection("admin_users")
	var existingAdmin models.AdminUser
	err := adminColl.FindOne(context.TODO(), bson.M{"email": email}).Decode(&existingAdmin)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already in use"})
		return
	}

	userColl := config.DB.Collection("users")
	var existingUser models.User
	err = userColl.FindOne(context.TODO(), bson.M{"email": email}).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already in use by a regular user"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	newAdmin := models.AdminUser{
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         req.Role,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	result, err := adminColl.InsertOne(context.TODO(), newAdmin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create admin user"})
		return
	}

	// Set ObjectID from insert result
	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		newAdmin.ID = oid
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": req.Role + " user created successfully",
		"admin_user": gin.H{
			"id":         newAdmin.ID.Hex(),
			"email":      newAdmin.Email,
			"role":       newAdmin.Role,
			"created_at": newAdmin.CreatedAt,
		},
	})
}

func SetupAdmin(c *gin.Context) {
	email := "admin@r3sec.xyz"
	password := "admin123"

	adminColl := config.DB.Collection("admin_users")
	var existingAdmin models.AdminUser
	err := adminColl.FindOne(context.TODO(), bson.M{"email": email}).Decode(&existingAdmin)

	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Admin user already exists",
			"email":   email,
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	newAdmin := models.AdminUser{
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         "admin",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	result, err := adminColl.InsertOne(context.TODO(), newAdmin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create admin user"})
		return
	}

	// Set ObjectID
	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		newAdmin.ID = oid
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Admin user created successfully",
		"email":    email,
		"password": password,
		"note":     "This endpoint should be disabled in production",
	})
}

func ListAdminUsers(c *gin.Context) {
	currentAdmin := c.MustGet("currentAdminUser").(models.AdminUser)
	
	if currentAdmin.Role != "admin" && currentAdmin.Role != "auditor" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
		return
	}
	
	adminColl := config.DB.Collection("admin_users")
	
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	cursor, err := adminColl.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve admin users"})
		return
	}
	defer cursor.Close(ctx)
	
	var adminUsers []gin.H
	
	for cursor.Next(ctx) {
		var admin models.AdminUser
		if err := cursor.Decode(&admin); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode admin user"})
			return
		}
		
		adminUsers = append(adminUsers, gin.H{
			"id":         admin.ID.Hex(),
			"email":      admin.Email,
			"role":       admin.Role,
			"created_at": admin.CreatedAt,
			"updated_at": admin.UpdatedAt,
		})
	}
	
	if err := cursor.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving admin users"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Admin users retrieved successfully",
		"users":   adminUsers,
	})
}

// DeleteAdminUser handles the deletion of an admin user
func DeleteAdminUser(c *gin.Context) {
	// Get current admin user from context
	currentAdmin := c.MustGet("currentAdminUser").(models.AdminUser)
	
	// Only admin role can delete users
	if currentAdmin.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can delete admin users"})
		return
	}
	
	// Get user ID from URL parameter
	userID := c.Param("id")
	
	// Convert string ID to ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}
	
	// Prevent admin from deleting their own account
	if currentAdmin.ID == objID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete your own admin account"})
		return
	}
	
	// Get admin users collection
	adminColl := config.DB.Collection("admin_users")
	
	// Set up context for database operation
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	// Delete the user
	result, err := adminColl.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete admin user"})
		return
	}
	
	// Check if any document was deleted
	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin user not found"})
		return
	}
	
	// Return success message
	c.JSON(http.StatusOK, gin.H{
		"message": "Admin user deleted successfully",
		"id":      userID,
	})
}

func UpdateAdminUser(c *gin.Context) {
	currentAdmin := c.MustGet("currentAdminUser").(models.AdminUser)
	
	if currentAdmin.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can modify admin users"})
		return
	}
	
	userID := c.Param("id")
	
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}
	
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	
	adminColl := config.DB.Collection("admin_users")
	
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	updateDoc := bson.M{"updated_at": time.Now()}
	
	if req.Email != "" {
		email := strings.ToLower(strings.TrimSpace(req.Email))
		
		var existingAdmin models.AdminUser
		err := adminColl.FindOne(ctx, bson.M{
			"email": email,
			"_id":   bson.M{"$ne": objID},
		}).Decode(&existingAdmin)
		
		if err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already in use by another admin"})
			return
		}
		
		userColl := config.DB.Collection("users")
		var existingUser models.User
		err = userColl.FindOne(ctx, bson.M{"email": email}).Decode(&existingUser)
		if err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already in use by a regular user"})
			return
		}
		
		updateDoc["email"] = email
	}
	
	if req.Role != "" {
		role := strings.ToLower(req.Role)
		if role != "admin" && role != "auditor" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Role must be either 'admin' or 'auditor'"})
			return
		}
		
		if role != "admin" {
			count, err := adminColl.CountDocuments(ctx, bson.M{
				"role": "admin",
				"_id":  bson.M{"$ne": objID},
			})
			
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify admin count"})
				return
			}
			
			if count == 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot demote the last admin user"})
				return
			}
		}
		
		updateDoc["role"] = role
	}
	
	if req.Password != "" {
		if len(req.Password) < 8 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 8 characters"})
			return
		}
		
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		
		updateDoc["password_hash"] = string(hashedPassword)
	}
	
	if len(updateDoc) <= 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided for update"})
		return
	}
	
	result, err := adminColl.UpdateOne(
		ctx,
		bson.M{"_id": objID},
		bson.M{"$set": updateDoc},
	)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update admin user"})
		return
	}
	
	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin user not found"})
		return
	}
	
	var updatedAdmin models.AdminUser
	err = adminColl.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedAdmin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve updated user"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Admin user updated successfully",
		"admin_user": gin.H{
			"id":         updatedAdmin.ID.Hex(),
			"email":      updatedAdmin.Email,
			"role":       updatedAdmin.Role,
			"created_at": updatedAdmin.CreatedAt,
			"updated_at": updatedAdmin.UpdatedAt,
		},
	})
}
