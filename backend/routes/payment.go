package routes

import (
	"github.com/gin-gonic/gin"
	"r3sec/controllers"
	"r3sec/middleware"
)

func PaymentRoutes(r *gin.RouterGroup) {
	payments := r.Group("/payments")
	payments.Use(middleware.AuthMiddleware())
	{
		payments.POST("/verify", controllers.VerifyPayment)
		payments.GET("", controllers.ListPayments)
		payments.GET("/:id", controllers.GetPayment)
	}
}
