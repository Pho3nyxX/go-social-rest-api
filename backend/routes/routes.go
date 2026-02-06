package routes

import (
	"net/http"

	"github.com/Pho3nyxX/social-media-restful-api-go/handlers"
)

func RegisterRoutes() {
	http.HandleFunc("/register", handlers.Register)
}
