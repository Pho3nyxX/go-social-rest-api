package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Pho3nyxX/social-media-restful-api-go/config"
	"github.com/Pho3nyxX/social-media-restful-api-go/routes"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	config.ConnectDB()

	routes.RegisterRoutes()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		http.DefaultServeMux.ServeHTTP(w, r)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
