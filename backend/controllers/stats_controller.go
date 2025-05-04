// ./controllers/user_stats_controller.go
package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"

	"r3sec/config"
	"r3sec/models"
)

func GetUserStats(c *gin.Context) {
	user := c.MustGet("currentUser").(models.User)

	statsResponse := gin.H{
		"user_id":    user.ID.Hex(),
		"email":      user.Email,
		"created_at": user.CreatedAt,
	}

	statsResponse["contracts"] = getUserContractStats(user.ID.Hex())
	statsResponse["findings"] = getUserFindingStats(user.ID.Hex())
	statsResponse["activity"] = getUserActivityStats(user.ID.Hex(), user)

	c.JSON(http.StatusOK, statsResponse)
}

func getUserContractStats(userID string) gin.H {
	contractsColl := config.DB.Collection("contracts")
	ctx := context.TODO()

	// Total contracts
	totalCount, _ := contractsColl.CountDocuments(ctx, bson.M{
		"user_id":    userID,
		"is_deleted": false,
	})

	// Contracts by status
	pendingCount, _ := contractsColl.CountDocuments(ctx, bson.M{
		"user_id":    userID,
		"is_deleted": false,
		"status":     "pending",
	})

	inProgressCount, _ := contractsColl.CountDocuments(ctx, bson.M{
		"user_id":    userID,
		"is_deleted": false,
		"status":     "in_progress",
	})

	completedCount, _ := contractsColl.CountDocuments(ctx, bson.M{
		"user_id":    userID,
		"is_deleted": false,
		"status":     "completed",
	})

	failedCount, _ := contractsColl.CountDocuments(ctx, bson.M{
		"user_id":    userID,
		"is_deleted": false,
		"status":     "failed",
	})

	// Contracts by upload type
	githubCount, _ := contractsColl.CountDocuments(ctx, bson.M{
		"user_id":     userID,
		"is_deleted":  false,
		"upload_type": "github",
	})

	programIdCount, _ := contractsColl.CountDocuments(ctx, bson.M{
		"user_id":     userID,
		"is_deleted":  false,
		"upload_type": "program_id",
	})

	// Get most recent contract
	var mostRecentContract models.Contract
	_ = contractsColl.FindOne(
		ctx,
		bson.M{"user_id": userID, "is_deleted": false},
		options.FindOne().SetSort(bson.M{"created_at": -1}),
	).Decode(&mostRecentContract)

	// Return compiled stats
	return gin.H{
		"total_count":       totalCount,
		"pending_count":     pendingCount,
		"in_progress_count": inProgressCount,
		"completed_count":   completedCount,
		"failed_count":      failedCount,
		"github_count":      githubCount,
		"program_id_count":  programIdCount,
		"most_recent": gin.H{
			"id":         mostRecentContract.ID,
			"name":       mostRecentContract.Name,
			"status":     mostRecentContract.Status,
			"created_at": mostRecentContract.CreatedAt,
		},
	}
}

// getUserFindingStats retrieves statistics about audit findings
func getUserFindingStats(userID string) gin.H {
	ctx := context.TODO()
	contractsColl := config.DB.Collection("contracts")
	reportsColl := config.DB.Collection("audit_reports")
	findingsColl := config.DB.Collection("findings")

	// Get all completed contracts for user
	var contracts []models.Contract
	cursor, err := contractsColl.Find(
		ctx,
		bson.M{
			"user_id":    userID,
			"is_deleted": false,
			"status":     "completed",
		},
	)

	if err != nil {
		return gin.H{"error": "Failed to retrieve contracts"}
	}
	defer cursor.Close(ctx)

	err = cursor.All(ctx, &contracts)
	if err != nil {
		return gin.H{"error": "Failed to decode contracts"}
	}

	// Get contract IDs
	var contractIDs []string
	for _, contract := range contracts {
		contractIDs = append(contractIDs, contract.ID)
	}

	// If no completed contracts, return empty stats
	if len(contractIDs) == 0 {
		return gin.H{
			"total_findings": 0,
			"severity_breakdown": gin.H{
				"critical": 0,
				"high":     0,
				"medium":   0,
				"low":      0,
				"info":     0,
			},
		}
	}

	// Get all reports for these contracts
	var reports []models.AuditReport
	reportsCursor, err := reportsColl.Find(
		ctx,
		bson.M{"contract_id": bson.M{"$in": contractIDs}},
	)

	if err != nil {
		return gin.H{"error": "Failed to retrieve reports"}
	}
	defer reportsCursor.Close(ctx)

	err = reportsCursor.All(ctx, &reports)
	if err != nil {
		return gin.H{"error": "Failed to decode reports"}
	}

	// Get report IDs
	var reportIDs []string
	totalFindingsCount := 0
	for _, report := range reports {
		reportIDs = append(reportIDs, report.ID)
		totalFindingsCount += report.FindingsCount
	}

	// Get severity breakdown
	severityCounts := struct {
		Critical int
		High     int
		Medium   int
		Low      int
		Info     int
	}{}

	// If there are reports, get severity counts
	if len(reportIDs) > 0 {
		pipeline := []bson.M{
			{"$match": bson.M{"report_id": bson.M{"$in": reportIDs}}},
			{"$group": bson.M{
				"_id":   "$severity",
				"count": bson.M{"$sum": 1},
			}},
		}

		severityCursor, err := findingsColl.Aggregate(ctx, pipeline)
		if err == nil {
			defer severityCursor.Close(ctx)

			var results []struct {
				ID    string `bson:"_id"`
				Count int    `bson:"count"`
			}

			if err = severityCursor.All(ctx, &results); err == nil {
				for _, result := range results {
					switch result.ID {
					case "critical":
						severityCounts.Critical = result.Count
					case "high":
						severityCounts.High = result.Count
					case "medium":
						severityCounts.Medium = result.Count
					case "low":
						severityCounts.Low = result.Count
					case "info":
						severityCounts.Info = result.Count
					}
				}
			}
		}
	}

	return gin.H{
		"total_findings": totalFindingsCount,
		"total_audits":   len(reports),
		"severity_breakdown": gin.H{
			"critical": severityCounts.Critical,
			"high":     severityCounts.High,
			"medium":   severityCounts.Medium,
			"low":      severityCounts.Low,
			"info":     severityCounts.Info,
		},
	}
}

// getUserActivityStats retrieves user activity statistics
func getUserActivityStats(userID string, user models.User) gin.H {
	logsColl := config.DB.Collection("audit_logs")
	ctx := context.TODO()

	// Activity over time periods
	lastDay := time.Now().AddDate(0, 0, -1)
	lastWeek := time.Now().AddDate(0, 0, -7)
	lastMonth := time.Now().AddDate(0, 0, -30)

	// Count activities by time period
	dayCount, _ := logsColl.CountDocuments(ctx, bson.M{
		"actor_id":   userID,
		"actor_role": "user",
		"created_at": bson.M{"$gte": lastDay},
	})

	weekCount, _ := logsColl.CountDocuments(ctx, bson.M{
		"actor_id":   userID,
		"actor_role": "user",
		"created_at": bson.M{"$gte": lastWeek},
	})

	monthCount, _ := logsColl.CountDocuments(ctx, bson.M{
		"actor_id":   userID,
		"actor_role": "user",
		"created_at": bson.M{"$gte": lastMonth},
	})

	// Activity by event type
	pipeline := []bson.M{
		{"$match": bson.M{
			"actor_id":   userID,
			"actor_role": "user",
		}},
		{"$group": bson.M{
			"_id":   "$event",
			"count": bson.M{"$sum": 1},
		}},
	}

	cursor, err := logsColl.Aggregate(ctx, pipeline)
	eventBreakdown := make(map[string]int)

	if err == nil {
		defer cursor.Close(ctx)

		var results []struct {
			Event string `bson:"_id"`
			Count int    `bson:"count"`
		}

		if err = cursor.All(ctx, &results); err == nil {
			for _, result := range results {
				eventBreakdown[result.Event] = result.Count
			}
		}
	}

	// Get average time to audit completion
	var avgCompletionDays float64 = 2.5 // Example: average completion in 2.5 days

	// For getting completedContracts count
	contractsColl := config.DB.Collection("contracts")
	completedCount, _ := contractsColl.CountDocuments(ctx, bson.M{
		"user_id":    userID,
		"is_deleted": false,
		"status":     "completed",
	})

	return gin.H{
		"activity_counts": gin.H{
			"last_24h": dayCount,
			"last_7d":  weekCount,
			"last_30d": monthCount,
		},
		"activity_types":      eventBreakdown,
		"avg_completion_days": avgCompletionDays,
		"completed_contracts": completedCount,
		"account_age_days":    int(time.Since(user.CreatedAt).Hours() / 24),
	}
}

