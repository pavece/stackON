package webhook

import (
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
)

type MongoWebhookRepo struct{
	Client *mongo.Client
}

func (repo *MongoWebhookRepo) GetWebhookById(id string) Webhook {
	fmt.Println("Hello from repo")
	return Webhook{}
}