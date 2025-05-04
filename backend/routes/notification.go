package routes

import (
	"github.com/gin-gonic/gin"
	"r3sec/controllers"
	"r3sec/middleware"
)

func NotificationRoutes(r *gin.RouterGroup) {
	notifications := r.Group("/notifications")
	notifications.Use(middleware.AuthMiddleware())
	{
		notifications.GET("", controllers.ListNotifications)
		notifications.POST("/:id/read", controllers.MarkNotificationRead)
	}
}
