package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ContractID string             `bson:"contract_id" json:"contract_id"`
	SenderID   string             `bson:"sender_id" json:"sender_id"`
	SenderRole string             `bson:"sender_role" json:"sender_role"` // 'user' or 'admin'
	Content    string             `bson:"content" json:"content"`
	IsRead     bool               `bson:"is_read" json:"is_read"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
}
