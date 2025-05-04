package routes

import (
	"github.com/gin-gonic/gin"
	"r3sec/controllers"
	"r3sec/middleware"
)

func ContractRoutes(r *gin.RouterGroup) {
	contracts := r.Group("/contracts")
	contracts.Use(middleware.AuthMiddleware())
	{
		contracts.GET("", controllers.ListContracts)
		contracts.POST("", controllers.CreateContract)
        contracts.POST("/:id/resubmit", controllers.ResubmitContract)
		contracts.GET("/:id", controllers.GetContract)
		contracts.DELETE("/:id", controllers.DeleteContract)
	}
}
