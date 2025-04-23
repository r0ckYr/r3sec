package routes

import (
    "github.com/gin-gonic/gin"
    "r3sec/controllers"
)

func SetupRoutes(r *gin.Engine) {
    api := r.Group("/api")
    {
        api.GET("/ping", controllers.Ping)
    }
    AuthRoutes(r)
}

