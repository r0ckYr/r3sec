package models

import "time"

type Notification struct {
	ID        string    `bson:"_id,omitempty" json:"id"`
	UserID    string    `bson:"user_id" json:"user_id"`
	Title     string    `bson:"title" json:"title"`
	Body      string    `bson:"body" json:"body"`
	IsRead    bool      `bson:"is_read" json:"is_read"`
	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}

