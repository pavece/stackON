package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func Start(dbUrl string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI(dbUrl))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("[INFO] Connected to mongo DB")
}

func GetClient() *mongo.Client{
	return client
}

func GetCollection(database string, colName string) *mongo.Collection{
	return client.Database(database).Collection(colName)
}