package platform

import "go.uber.org/zap"

// NewLogger returns a zap logger. Every log line downstream should be
// structured (zap.String/zap.Int fields), never fmt.Sprintf'd into the
// message — that's what makes logs queryable once they land in Loki/Grafana.
func NewLogger(env string) (*zap.Logger, error) {
	if env == "production" {
		return zap.NewProduction()
	}
	return zap.NewDevelopment()
}
