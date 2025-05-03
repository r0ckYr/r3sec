package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"r3sec/config"
	"r3sec/models"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func AuthMiddleware() gin.HandlerFunc {
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

		userID := claims["id"].(string)
		objID, err := primitive.ObjectIDFromHex(userID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Invalid user ID"})
			return
		}

		var user models.User
		userColl := config.DB.Collection("users")
		err = userColl.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "User not found"})
			return
		}

		c.Set("currentUser", user)
		c.Next()
	}
}

