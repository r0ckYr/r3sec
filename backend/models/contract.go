package models

import "time"

type Contract struct {
	ID          string    `bson:"_id,omitempty" json:"id"`
	UserID      string    `bson:"user_id" json:"user_id"`
	Name        string    `bson:"name" json:"name"`
	Description string    `bson:"description,omitempty" json:"description,omitempty"`
	UploadType  string    `bson:"upload_type" json:"upload_type"`
	UploadURL   string    `bson:"upload_url" json:"upload_url"`
	PaymentID   string    `bson:"payment_id" json:"payment_id"`
    PlanID        string    `bson:"plan_id" json:"plan_id"`
    PaymentStatus string    `bson:"payment_status" json:"payment_status"`
	Status      string    `bson:"status" json:"status"`
	IsDeleted   bool      `bson:"is_deleted" json:"is_deleted"`
	CreatedAt   time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time `bson:"updated_at" json:"updated_at"`
}
