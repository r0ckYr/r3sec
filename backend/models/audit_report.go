package models

import "time"

type AuditReport struct {
	ID              string    `bson:"_id,omitempty" json:"id"`
	ContractID      string    `bson:"contract_id" json:"contract_id"`
	UploadedBy      string    `bson:"uploaded_by" json:"uploaded_by"` // admin user
	ReportURL       string    `bson:"report_url" json:"report_url"`
	Summary         string    `bson:"summary" json:"summary"`
	SeveritySummary string    `bson:"severity_summary" json:"severity_summary"` // severity_level
	FindingsCount   int       `bson:"findings_count" json:"findings_count"`
	UploadedAt      time.Time `bson:"uploaded_at" json:"uploaded_at"`
	UpdatedAt       time.Time `bson:"updated_at" json:"updated_at"`
}

