package testcontrollers

import (
	"context"
	"net/http"

	"github.com/pavece/stackON/internal/api"
	"github.com/pavece/stackON/internal/db"
)

type test struct {
	Key string `bson:"key"`
}

func TestController(w http.ResponseWriter, r *http.Request) {
	db.GetCollection("testdb", "test").InsertOne(context.Background(), test{Key: r.URL.Query().Get("value")})

	api.SendJson(w, 201, map[string]string{"message": "Record added to the database"})
}