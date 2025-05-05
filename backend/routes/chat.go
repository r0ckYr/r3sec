package routes

import (
	"github.com/gin-gonic/gin"
	"r3sec/controllers"
	"r3sec/middleware"
)

func ChatRoutes(r *gin.RouterGroup) {
	chat := r.Group("/chat")
	chat.Use(middleware.AuthMiddleware())
	{
		chat.GET("/contracts/:id/messages", controllers.GetContractMessages)
		chat.POST("/contracts/:id/messages", controllers.SendMessage)
		chat.PUT("/messages/:id/read", controllers.MarkMessageRead)
        chat.GET("/contracts/unread", controllers.GetContractsWithUnreadMessages)
	}
}
