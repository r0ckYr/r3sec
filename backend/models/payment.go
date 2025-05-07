package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Payment struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID            string             `bson:"user_id" json:"user_id"`
	PlanID            string             `bson:"plan_id" json:"plan_id"`
	WalletAddress     string             `bson:"wallet_address,omitempty" json:"wallet_address,omitempty"`
	Signature         string             `bson:"signature,omitempty" json:"signature,omitempty"`
	AmountSOL         string             `bson:"amount_sol" json:"amount_sol"`
	AmountUSD         int                `bson:"amount_usd" json:"amount_usd"`
	SolPriceAtPayment float64            `bson:"sol_price_at_payment" json:"sol_price_at_payment"`
	Network           string             `bson:"network" json:"network"`
	Status            string             `bson:"status" json:"status"` // 'pending', 'verified', 'failed'
	VerifiedAt        time.Time          `bson:"verified_at,omitempty" json:"verified_at,omitempty"`
	CreatedAt         time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt         time.Time          `bson:"updated_at" json:"updated_at"`
}

var PlanPrices = map[string]int{
	"standard":   50,
	"advanced":   500,
	"enterprise": 1000,
}
