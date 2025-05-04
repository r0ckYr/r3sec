package controllers

import (
	"context"
	"crypto/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/idtoken"

	"r3sec/config"
	"r3sec/models"
	"r3sec/schemas"
	"r3sec/utils"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func Register(c *gin.Context) {
	var req schemas.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	username := strings.TrimSpace(req.Username)
	userColl := config.DB.Collection("users")

	var existing models.User
	if err := userColl.FindOne(context.TODO(), bson.M{"email": email}).Decode(&existing); err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Email already in use"})
		return
	}

	if err := userColl.FindOne(context.TODO(), bson.M{"username": username}).Decode(&existing); err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Username already taken"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	newUser := models.User{
		Email:                     email,
		PasswordHash:              string(hashedPassword),
		EmailNotificationsEnabled: true,
		IsVerified:                false,
		CreatedAt:                 time.Now(),
		UpdatedAt:                 time.Now(),
	}
	res, err := userColl.InsertOne(context.TODO(), newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not register user"})
		return
	}
	id := res.InsertedID.(primitive.ObjectID).Hex()
	token, _ := utils.GenerateEmailToken(id, email)
	utils.SendVerificationEmail(email, token)
	c.JSON(http.StatusCreated, gin.H{"message": "Registered. Please verify your email."})
}

func VerifyEmail(c *gin.Context) {
	tokenStr := c.Query("token")
	if tokenStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Token missing"})
		return
	}

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid or expired token"})
		return
	}

	userID := claims["id"].(string)
	email := claims["email"].(string)

	userColl := config.DB.Collection("users")
	objID, _ := primitive.ObjectIDFromHex(userID)

	var user models.User
	err = userColl.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user)
	if err != nil || user.Email != email {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid token data"})
		return
	}

	if user.IsVerified {
		c.JSON(http.StatusOK, gin.H{"message": "Email already verified"})
		return
	}

	_, err = userColl.UpdateOne(context.TODO(), bson.M{"_id": objID}, bson.M{"$set": bson.M{"is_verified": true}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email verified"})
}

func ResendVerification(c *gin.Context) {
	var req struct {
		Email string `json:"email"`
	}
	c.BindJSON(&req)
	userColl := config.DB.Collection("users")

	var user models.User
	err := userColl.FindOne(context.TODO(), bson.M{"email": req.Email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User not found"})
		return
	}

	if user.IsVerified {
		c.JSON(http.StatusOK, gin.H{"message": "Email already verified"})
		return
	}
	token, _ := utils.GenerateEmailToken(user.ID.Hex(), user.Email)
	utils.SendVerificationEmail(user.Email, token)
	c.JSON(http.StatusOK, gin.H{"message": "Verification email resent"})
}

func Login(c *gin.Context) {
	var req schemas.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	userColl := config.DB.Collection("users")
	var user models.User
	err := userColl.FindOne(context.TODO(), bson.M{"email": req.Email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	if !user.IsVerified {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Email not verified"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	token, _ := utils.GenerateJWT(user.ID.Hex(), user.Email)

	userResponse := gin.H{
		"id":          user.ID.Hex(),
		"email":       user.Email,
		"is_verified": user.IsVerified,
		"is_deleted":  user.IsDeleted,
		"created_at":  user.CreatedAt,
		"updated_at":  user.UpdatedAt,
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"user":    userResponse,
	})
}

func GoogleLogin(c *gin.Context) {
	var req schemas.GoogleLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	payload, err := idtoken.Validate(context.Background(), req.IDToken, os.Getenv("GOOGLE_CLIENT_ID"))
	if err != nil || payload.Claims["email"] == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Google token"})
		return
	}
	email := payload.Claims["email"].(string)

	userColl := config.DB.Collection("users")
	var user models.User
	err = userColl.FindOne(context.TODO(), bson.M{"email": email}).Decode(&user)

	if err != nil {
		randomBytes := make([]byte, 16)
		rand.Read(randomBytes)
		hash, _ := bcrypt.GenerateFromPassword(randomBytes, 10)
		user = models.User{
			Email:                     email,
			PasswordHash:              string(hash),
			EmailNotificationsEnabled: true,
			IsVerified:                true,
			CreatedAt:                 time.Now(),
			UpdatedAt:                 time.Now(),
		}
		res, insertErr := userColl.InsertOne(context.TODO(), user)
		if insertErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
		user.ID = res.InsertedID.(primitive.ObjectID)
	}

	token, _ := utils.GenerateJWT(user.ID.Hex(), user.Email)

	userResponse := gin.H{
		"id":          user.ID.Hex(),
		"email":       user.Email,
		"is_verified": user.IsVerified,
		"is_deleted":  user.IsDeleted,
		"created_at":  user.CreatedAt,
		"updated_at":  user.UpdatedAt,
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Google login successful",
		"token":   token,
		"user":    userResponse,
	})
}

func AdminLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))

	adminColl := config.DB.Collection("admin_users")
	var admin models.AdminUser
	err := adminColl.FindOne(context.TODO(), bson.M{"email": email}).Decode(&admin)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	tokenString, err := utils.GenerateAdminJWT(admin.ID.Hex(), admin.Email, admin.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	_, err = adminColl.UpdateOne(
		context.TODO(),
		bson.M{"_id": admin.ID},
		bson.M{
			"$set": bson.M{
				"last_login": time.Now(),
				"updated_at": time.Now(),
			},
		},
	)

	c.JSON(http.StatusOK, gin.H{
		"message": "Admin login successful",
		"token":   tokenString,
		"admin": gin.H{
			"id":    admin.ID.Hex(),
			"email": admin.Email,
			"role":  admin.Role,
		},
	})
}
