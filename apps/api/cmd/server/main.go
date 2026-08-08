package main

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/jack/digital-bank/api/internal/auth"
	"github.com/jack/digital-bank/api/internal/platform"
)

func main() {
	cfg := platform.LoadConfig()

	logger, err := platform.NewLogger(cfg.Env)
	if err != nil {
		log.Fatalf("failed to init logger: %v", err)
	}
	defer logger.Sync()

	db, err := platform.NewDB(cfg.DatabaseURL)
	if err != nil {
		logger.Fatal("failed to connect to database", zapErr(err))
	}
	defer db.Close()

	router := gin.New()
	router.Use(platform.RequestID(), platform.RequestLogger(logger), gin.Recovery())

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Auth is wired but routes are left for you to add per-module as you
	// build accounts/payments/pockets — this just proves the OIDC verifier
	// works end to end.
	if cfg.OIDCIssuerURL != "" {
		verifier, err := auth.NewVerifier(context.Background(), cfg.OIDCIssuerURL, cfg.OIDCClientID)
		if err != nil {
			logger.Fatal("failed to init OIDC verifier", zapErr(err))
		}
		authed := router.Group("/api/v1")
		authed.Use(verifier.RequireAuth())
		authed.GET("/me", func(c *gin.Context) {
			userID, _ := auth.UserID(c)
			c.JSON(http.StatusOK, gin.H{"user_id": userID})
		})
	} else {
		logger.Warn("OIDC_ISSUER_URL not set — auth-protected routes are disabled")
	}

	logger.Info("starting server", stringField("port", cfg.HTTPPort))
	if err := router.Run(":" + cfg.HTTPPort); err != nil {
		logger.Fatal("server stopped", zapErr(err))
	}
}
