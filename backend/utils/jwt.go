package utils

import (
    "os"
    "time"

    "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func GenerateEmailToken(userID string, email string) (string, error) {
    claims := jwt.MapClaims{
        "id":    userID,
        "email": email,
        "exp":   time.Now().Add(24 * time.Hour).Unix(),
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
}

func GenerateJWT(userID string, email string) (string, error) {
    claims := jwt.MapClaims{
        "id":    userID,
        "email": email,
        "exp":   time.Now().Add(24 * time.Hour).Unix(),
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
}

