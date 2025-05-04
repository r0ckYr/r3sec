package routes

import (
	"github.com/gin-gonic/gin"
	"r3sec/controllers"
	"r3sec/middleware"
)

func FindingRoutes(r *gin.RouterGroup) {
	reports := r.Group("/reports")
	reports.Use(middleware.AuthMiddleware())
	{
		reports.GET("/:id/findings", controllers.ListFindingsByReport)
	}

	findings := r.Group("/findings")
	findings.Use(middleware.AuthMiddleware())
	{
		findings.GET("/:id", controllers.GetFinding)
	}
}
