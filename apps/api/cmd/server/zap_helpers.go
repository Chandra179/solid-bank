package main

import "go.uber.org/zap"

// Small helpers so main.go reads cleanly without importing zap's field
// constructors inline everywhere.
func zapErr(err error) zap.Field        { return zap.Error(err) }
func stringField(k, v string) zap.Field { return zap.String(k, v) }
