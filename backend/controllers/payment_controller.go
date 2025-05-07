package controllers

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gagliardetto/binary"
	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"r3sec/config"
	"r3sec/models"
)

// ListPayments retrieves payments for the current user with optional filtering and sorting
func ListPayments(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)

	// Get query parameters
	planID := c.Query("plan_id")
	status := c.Query("status")
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")
	sortBy := c.DefaultQuery("sort_by", "created_at")
	sortOrder := c.DefaultQuery("sort_order", "desc")
	walletAddress := c.Query("wallet_address")
	
	// Create base query - user can only see their own payments
	query := bson.M{"user_id": user.ID.Hex()}
	
	// Add optional filters to query
	if planID != "" {
		if _, validPlan := models.PlanPrices[planID]; !validPlan {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid plan ID"})
			return
		}
		query["plan_id"] = planID
	}
	
	if status != "" {
		validStatuses := map[string]bool{
			"pending":  true,
			"verified": true,
			"failed":   true,
		}
		if !validStatuses[status] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment status"})
			return
		}
		query["status"] = status
	}
	
	if walletAddress != "" {
		query["wallet_address"] = walletAddress
	}
	
	// Handle date range filter
	if startDateStr != "" || endDateStr != "" {
		dateQuery := bson.M{}
		
		if startDateStr != "" {
			startDate, err := time.Parse(time.RFC3339, startDateStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format. Use RFC3339 format."})
				return
			}
			dateQuery["$gte"] = startDate
		}
		
		if endDateStr != "" {
			endDate, err := time.Parse(time.RFC3339, endDateStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format. Use RFC3339 format."})
				return
			}
			// Add one day to include the entire end date
			endDate = endDate.Add(24 * time.Hour)
			dateQuery["$lt"] = endDate
		}
		
		if len(dateQuery) > 0 {
			query["created_at"] = dateQuery
		}
	}
	
	// Determine sort direction
	var sortDirection int
	if sortOrder == "asc" {
		sortDirection = 1
	} else {
		sortDirection = -1
	}
	
	// Valid fields for sorting
	validSortFields := map[string]bool{
		"created_at":   true,
		"updated_at":   true,
		"amount_usd":   true,
		"amount_sol":   true,
		"status":       true,
	}
	
	if !validSortFields[sortBy] {
		sortBy = "created_at" // Default sort field if invalid
	}
	
	// Set up options for sorting and pagination
	findOptions := options.Find()
	findOptions.SetSort(bson.M{sortBy: sortDirection})
	
	// Add pagination if provided
	limit := c.DefaultQuery("limit", "0")
	skip := c.DefaultQuery("skip", "0")
	if limit != "0" {
		limitInt, err := strconv.ParseInt(limit, 10, 64)  // Use strconv.ParseInt instead
		if err == nil && limitInt > 0 {
			findOptions.SetLimit(limitInt)
			
			skipInt, err := strconv.ParseInt(skip, 10, 64)  // Use strconv.ParseInt instead
			if err == nil && skipInt >= 0 {
				findOptions.SetSkip(skipInt)
			}
		}
	}
	
	// Execute query
	paymentsColl := config.DB.Collection("payments")
	cursor, err := paymentsColl.Find(context.TODO(), query, findOptions)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve payments"})
		return
	}
	defer cursor.Close(context.TODO())
	
	var payments []models.Payment
	if err = cursor.All(context.TODO(), &payments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode payments"})
		return
	}
	
	// Count total documents for pagination metadata
	totalCount, err := paymentsColl.CountDocuments(context.TODO(), query)
	if err != nil {
		totalCount = int64(len(payments))
	}
	
	c.JSON(http.StatusOK, gin.H{
		"payments": payments,
		"metadata": gin.H{
			"total":      totalCount,
			"count":      len(payments),
			"filters":    query,
			"sort_by":    sortBy,
			"sort_order": sortOrder,
		},
	})
}

// GetPayment retrieves a specific payment by ID for the current user
func GetPayment(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)
	paymentID := c.Param("id")

	// Convert string ID to ObjectID
	objID, err := primitive.ObjectIDFromHex(paymentID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment ID format"})
		return
	}

	// Get the payment from the database
	var payment models.Payment
	paymentsColl := config.DB.Collection("payments")
	err = paymentsColl.FindOne(
		context.TODO(),
		bson.M{
			"_id":     objID,
			"user_id": user.ID.Hex(),
		},
	).Decode(&payment)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"payment": payment})
}

func VerifyPayment(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get user from context"})
		return
	}

	user := currentUser.(models.User)

	var req struct {
		Signature         string  `json:"signature" binding:"required"`
		PlanID            string  `json:"plan_id" binding:"required"`
		WalletAddress     string  `json:"wallet_address" binding:"required"`
		AmountSOL         string  `json:"amount_sol" binding:"required"`
		AmountUSD         int     `json:"amount_usd" binding:"required"`
		SolPriceAtPayment float64 `json:"sol_price_at_payment" binding:"required"`
		Network           string  `json:"network" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Validate plan ID and price
	expectedPrice, validPlan := models.PlanPrices[req.PlanID]
	if !validPlan {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid plan ID"})
		return
	}

	if req.AmountUSD != expectedPrice {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price for the selected plan"})
		return
	}

	// Verify payment on Solana blockchain
	verified, err := verifySolanaTransaction(req.Signature, req.Network, req.WalletAddress, req.AmountSOL)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Transaction verification failed: %v", err)})
		return
	}

	if !verified {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid transaction"})
		return
	}

	// Create payment record
	now := time.Now()
	payment := models.Payment{
		ID:                primitive.NewObjectID(),
		UserID:            user.ID.Hex(),
		PlanID:            req.PlanID,
		WalletAddress:     req.WalletAddress,
		Signature:         req.Signature,
		AmountSOL:         req.AmountSOL,
		AmountUSD:         req.AmountUSD,
		SolPriceAtPayment: req.SolPriceAtPayment,
		Network:           req.Network,
		Status:            "verified",
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	// Save payment to database
	paymentColl := config.DB.Collection("payments")
	_, err = paymentColl.InsertOne(context.TODO(), payment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment verified successfully",
		"payment": payment,
	})
}

func verifySolanaTransaction(signature, network, walletAddress, amountSOL string) (bool, error) {
	sig, err := solana.SignatureFromBase58(signature)
	if err != nil {
		return false, fmt.Errorf("invalid signature format: %v", err)
	}

	recipientWallet := os.Getenv("WALLET_ADDRESS")

	var endpoint string
	if network == "mainnet" {
		endpoint = rpc.MainNetBeta_RPC
	} else if network == "devnet" {
		endpoint = rpc.DevNet_RPC
	} else {
		return false, fmt.Errorf("unsupported network: %s", network)
	}

	client := rpc.New(endpoint)

	txResp, err := client.GetTransaction(context.Background(), sig, &rpc.GetTransactionOpts{
		Encoding:   "base64", // <- fixed string
		Commitment: rpc.CommitmentFinalized,
	})
	if err != nil {
		return false, fmt.Errorf("failed to fetch transaction: %v", err)
	}

	if txResp == nil || txResp.Meta == nil {
		return false, fmt.Errorf("transaction not found or incomplete")
	}

	if txResp.Meta.Err != nil {
		return false, fmt.Errorf("transaction failed on-chain: %v", txResp.Meta.Err)
	}

	if txResp.BlockTime == nil {
		return false, fmt.Errorf("transaction block time not available")
	}
	txTime := time.Unix(int64(*txResp.BlockTime), 0)
	if txTime.Before(time.Now().Add(-1 * time.Hour)) {
		return false, fmt.Errorf("transaction is too old")
	}

	expectedAmount, err := strconv.ParseFloat(amountSOL, 64)
	if err != nil {
		return false, fmt.Errorf("invalid SOL amount: %v", err)
	}

	// Parse the raw base64-encoded transaction
	rawTx := txResp.Transaction.GetBinary()
	decoder := bin.NewBinDecoder(rawTx)

	tx, err := solana.TransactionFromDecoder(decoder)
	if err != nil {
		return false, fmt.Errorf("failed to decode transaction: %v", err)
	}

	message := tx.Message
	recipientFound := false
	senderFound := false
	var recipientIndex int

	for i, account := range message.AccountKeys {
		if account.String() == recipientWallet {
			recipientFound = true
			recipientIndex = i
		}
		if account.String() == walletAddress {
			senderFound = true
		}
	}

	if !recipientFound {
		return false, fmt.Errorf("recipient wallet not found in transaction")
	}
	if !senderFound {
		return false, fmt.Errorf("sender wallet not found in transaction")
	}

	if len(txResp.Meta.PreBalances) <= recipientIndex || len(txResp.Meta.PostBalances) <= recipientIndex {
		return false, fmt.Errorf("balance data for recipient not found")
	}

	preBalance := float64(txResp.Meta.PreBalances[recipientIndex]) / 1e9
	postBalance := float64(txResp.Meta.PostBalances[recipientIndex]) / 1e9
	transferredAmount := postBalance - preBalance

	if math.Abs(transferredAmount-expectedAmount) > 0.001 {
		return false, fmt.Errorf("transfer amount mismatch: expected %f SOL, found %f SOL",
			expectedAmount, transferredAmount)
	}

	return true, nil
}

