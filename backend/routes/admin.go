package routes

import (
	"github.com/gin-gonic/gin"
	"r3sec/controllers"
	"r3sec/middleware"
)

func AdminRoutes(r *gin.RouterGroup) {
	admin := r.Group("/admin")
	admin.POST("/setup", controllers.SetupAdmin)
	admin.Use(middleware.AdminAuthMiddleware())
	{
		admin.POST("/users", controllers.CreateAdminUser)
		admin.GET("/contracts", controllers.AdminListContracts)
		admin.GET("/contracts/:id", controllers.AdminGetContract)
		admin.PUT("/contracts/:id/status", controllers.UpdateContractStatus)
		admin.GET("/logs", controllers.AdminListLogs)
		admin.GET("/contracts/:id/logs", controllers.AdminGetContractLogs)
		admin.POST("/reports", controllers.CreateAuditReport)
		admin.POST("/reports/:id/findings", controllers.AddReportFindings)
		admin.GET("/chat/contracts/:id/messages", controllers.AdminGetContractMessages)
		admin.GET("/chat/contracts/unread", controllers.AdminGetUnreadMessagesSummary)
		admin.POST("/chat/contracts/:id/messages", controllers.AdminSendMessage)
		admin.PUT("/chat/messages/:id/read", controllers.AdminMarkMessageRead)
		admin.GET("/users", controllers.ListAdminUsers)
		admin.DELETE("/users/:id", controllers.DeleteAdminUser)
		admin.PUT("/users/:id", controllers.UpdateAdminUser)
	}
}
