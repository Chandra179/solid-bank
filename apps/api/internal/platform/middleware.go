package platform

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

const RequestIDHeader = "X-Request-ID"
const requestIDContextKey = "request_id"

// RequestID stamps every request with an ID (or reuses an inbound one) so
// logs, traces, and audit entries for a single request can all be
// correlated later — set this up before you need it, not after.
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetHeader(RequestIDHeader)
		if id == "" {
			id = uuid.NewString()
		}
		c.Set(requestIDContextKey, id)
		c.Writer.Header().Set(RequestIDHeader, id)
		c.Next()
	}
}

// RequestLogger logs one structured line per request, including the
// request ID so it can be grepped/correlated across the stack.
func RequestLogger(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		requestID, _ := c.Get(requestIDContextKey)
		logger.Info("http_request",
			zap.String("request_id", toString(requestID)),
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status", c.Writer.Status()),
		)
	}
}

func toString(v any) string {
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}
