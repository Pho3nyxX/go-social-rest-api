package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/Pho3nyxX/go-social-rest-api/config"
	"github.com/Pho3nyxX/go-social-rest-api/routes"
	"github.com/Pho3nyxX/go-social-rest-api/utils"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	config.ConnectDB()
	utils.InitValidator()

	router := gin.Default()
	router.SetTrustedProxies(nil)

	// router.Use(cors.Default())
	frontendURL := os.Getenv("FRONTEND_URL")

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	routes.RegisterRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server running on port", port)
	router.Run(":" + port)
}
