package models

import "time"

type AuditLog struct {
	ID         string    `bson:"_id,omitempty" json:"id"`
	ContractID string    `bson:"contract_id" json:"contract_id"`
	Event      string    `bson:"event" json:"event"` // e.g., 'Uploaded', 'Completed'
	ActorID    string    `bson:"actor_id,omitempty" json:"actor_id,omitempty"`
	ActorRole  string    `bson:"actor_role,omitempty" json:"actor_role,omitempty"` // 'user', 'admin'
	CreatedAt  time.Time `bson:"created_at" json:"created_at"`
}
