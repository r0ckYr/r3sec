package main

import (
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"r3sec/config"
	"r3sec/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env")
	}

	config.ConnectMongo()

	r := gin.Default()

	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "*"
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{corsOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	routes.SetupRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	log.Printf("Server running at http://localhost:%s", port)
	r.Run(":" + port)
}
