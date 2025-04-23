package models

import "time"

type Contract struct {
	ID          string    `bson:"_id,omitempty" json:"id"`
	UserID      string    `bson:"user_id" json:"user_id"`
	Name        string    `bson:"name" json:"name"`
	Description string    `bson:"description,omitempty" json:"description,omitempty"`
	UploadType  string    `bson:"upload_type" json:"upload_type"` // 'zip', 'github', 'program_id'
	UploadURL   string    `bson:"upload_url" json:"upload_url"`
	FileName    string    `bson:"file_name,omitempty" json:"file_name,omitempty"`
	MimeType    string    `bson:"mime_type,omitempty" json:"mime_type,omitempty"`
	Status      string    `bson:"status" json:"status"` // 'pending', 'in_progress', etc.
	IsDeleted   bool      `bson:"is_deleted" json:"is_deleted"`
	CreatedAt   time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time `bson:"updated_at" json:"updated_at"`
}

