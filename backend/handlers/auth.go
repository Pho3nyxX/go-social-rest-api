package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/Pho3nyxX/social-media-restful-api-go/config"
	"github.com/Pho3nyxX/social-media-restful-api-go/models"
)

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Invalid request body",
		})
		return
	}

	if user.Username == "" || user.Email == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Username and email required",
		})
		return
	}

	user.CreatedAt = time.Now()

	collection := config.DB.Collection("users")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Could not save user",
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "User registered successfully",
	})
}
