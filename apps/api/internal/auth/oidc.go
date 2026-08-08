// Package auth makes this service an OIDC *relying party* — it validates
// JWTs issued by an external identity provider (Auth0 today, optionally
// Keycloak later). It never issues tokens itself and never stores
// passwords: that responsibility stays with the IdP by design.
package auth

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gin-gonic/gin"
)

type Verifier struct {
	provider *oidc.Provider
	verifier *oidc.IDTokenVerifier
}

func NewVerifier(ctx context.Context, issuerURL, clientID string) (*Verifier, error) {
	provider, err := oidc.NewProvider(ctx, issuerURL)
	if err != nil {
		return nil, err
	}
	return &Verifier{
		provider: provider,
		verifier: provider.Verifier(&oidc.Config{ClientID: clientID}),
	}, nil
}

const userContextKey = "auth_user_id"

// RequireAuth is gin middleware that validates the bearer token and stores
// the verified subject (user ID) in the request context for handlers to use.
func (v *Verifier) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := bearerToken(c.Request.Header.Get("Authorization"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing or malformed bearer token"})
			return
		}

		idToken, err := v.verifier.Verify(c.Request.Context(), token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		c.Set(userContextKey, idToken.Subject)
		c.Next()
	}
}

func UserID(c *gin.Context) (string, bool) {
	v, ok := c.Get(userContextKey)
	if !ok {
		return "", false
	}
	s, ok := v.(string)
	return s, ok
}

func bearerToken(header string) (string, error) {
	const prefix = "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return "", errors.New("missing bearer prefix")
	}
	return strings.TrimPrefix(header, prefix), nil
}
