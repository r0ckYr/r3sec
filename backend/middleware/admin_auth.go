package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"r3sec/config"
	"r3sec/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Invalid token"})
			return
		}

		// Role-based access control
		role, roleExists := claims["role"].(string)
		if !roleExists || (role != "admin" && role != "auditor") {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Insufficient permissions"})
			return
		}

		// Restrict certain endpoints to admin only
		if c.Request.URL.Path == "/api/admin/users" && role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Admin role required"})
			return
		}

		// Extract user ID from claims (now stored as string)
		userIDStr, ok := claims["id"].(string)
		if !ok || userIDStr == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Invalid user ID in token"})
			return
		}

		userObjID, err := primitive.ObjectIDFromHex(userIDStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Invalid user ID format"})
			return
		}

		var adminUser models.AdminUser
		adminColl := config.DB.Collection("admin_users")
		err = adminColl.FindOne(context.TODO(), bson.M{"_id": userObjID}).Decode(&adminUser)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Admin user not found"})
			return
		}

		c.Set("currentAdminUser", adminUser)
		c.Next()
	}
}
