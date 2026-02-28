package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/Pho3nyxX/social-media-restful-api-go/handlers"
	"github.com/Pho3nyxX/social-media-restful-api-go/middleware"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)
	// r.POST("/posts", middleware.AuthMiddleware(), handlers.CreatePost)
	// r.GET("/posts", middleware.AuthMiddleware(), handlers.GetPosts)

	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/posts", handlers.CreatePost)
		protected.GET("/posts", handlers.GetPosts)
	}
}
