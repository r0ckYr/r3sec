package models

import "time"
import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email        string    `bson:"email" json:"email"`
	PasswordHash string    `bson:"password_hash" json:"-"`
	IsDeleted    bool      `bson:"is_deleted" json:"is_deleted"`
	IsVerified   bool      `bson:"is_verified" json:"is_verified"`
	CreatedAt    time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time `bson:"updated_at" json:"updated_at"`
}

