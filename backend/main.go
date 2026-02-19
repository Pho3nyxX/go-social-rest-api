package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/Pho3nyxX/social-media-restful-api-go/config"
	"github.com/Pho3nyxX/social-media-restful-api-go/routes"
	"github.com/Pho3nyxX/social-media-restful-api-go/utils"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	config.ConnectDB()
	utils.InitValidator()

	router := gin.Default()
	router.SetTrustedProxies(nil)

	router.Use(cors.Default())

	routes.RegisterRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server running on port", port)
	router.Run(":" + port)
}
