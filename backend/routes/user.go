package routes

import (
	"github.com/gin-gonic/gin"
	"r3sec/controllers"
	"r3sec/middleware"
)

func UserRoutes(r *gin.RouterGroup) {
	users := r.Group("/user")
	authUsers := users.Use(middleware.AuthMiddleware())
	{
		authUsers.GET("/me", controllers.GetMe)
		authUsers.GET("/stats", controllers.GetUserStats)
		authUsers.PATCH("/:id", controllers.UpdateUser)
		authUsers.DELETE("/:id", controllers.DeleteUser)
		authUsers.PATCH("/:id/password", controllers.ChangePassword)
		authUsers.PATCH("/notifications", controllers.UpdateEmailNotifications)
	}
}
