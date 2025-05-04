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
