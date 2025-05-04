package routes

import (
	"github.com/gin-gonic/gin"
	"r3sec/controllers"
	"r3sec/middleware"
)

func AuditReportRoutes(r *gin.RouterGroup) {
	reports := r.Group("/reports")
	reports.Use(middleware.AuthMiddleware())
	{
		reports.GET("", controllers.ListAuditReports)
		reports.GET("/:id", controllers.GetAuditReport)
		reports.GET("/:id/download", controllers.DownloadAuditReport)
	}

	contracts := r.Group("/contracts")
	contracts.Use(middleware.AuthMiddleware())
	{
		contracts.GET("/:id/report", controllers.GetAuditReportByContract)
	}
}
