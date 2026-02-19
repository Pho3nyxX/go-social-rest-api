package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/Pho3nyxX/social-media-restful-api-go/handlers"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/register", handlers.Register)
}
