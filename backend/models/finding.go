package models

import "time"

type Finding struct {
	ID            string    `bson:"_id,omitempty" json:"id"`
	ReportID      string    `bson:"report_id" json:"report_id"`
	Title         string    `bson:"title" json:"title"`
	Severity      string    `bson:"severity" json:"severity"` // severity_level
	Description   string    `bson:"description" json:"description"`
	Recommendation string   `bson:"recommendation" json:"recommendation"`
	CreatedAt     time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt     time.Time `bson:"updated_at" json:"updated_at"`
}

