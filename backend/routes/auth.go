package routes
import (
	"github.com/gin-gonic/gin"
	"r3sec/controllers"
)
func AuthRoutes(r *gin.RouterGroup) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.GET("/verify-email", controllers.VerifyEmail)
		auth.POST("/resend-verification", controllers.ResendVerification)
		auth.POST("/login", controllers.Login)
		auth.POST("/google", controllers.GoogleLogin)
        auth.POST("/admin/login", controllers.AdminLogin)
        auth.POST("/forgot-password", controllers.ForgotPassword)
        auth.POST("/reset-password", controllers.ResetPassword)
	}
}
