package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	Username  string             `json:"username" validate:"required,min=3,max=20,alphanum,hasletter"`
	Email     string             `json:"email" validate:"required,email"`
	CreatedAt time.Time          `json:"createdAt"`
}
