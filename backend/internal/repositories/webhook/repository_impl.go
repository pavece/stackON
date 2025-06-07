package webhook

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoWebhookRepo struct{
	Client *mongo.Client
}

func (repo *MongoWebhookRepo) GetWebhookById(id string) (*Webhook, error) {
	var webhook Webhook;

	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	err = repo.Client.Database("stackON").Collection("webhooks").FindOne(context.Background(), bson.M{"_id": objId}).Decode(&webhook)
	return &webhook, err
}

func (repo *MongoWebhookRepo) GetWebhooks() ([]Webhook, error) {
	cursor, err := repo.Client.Database("stackON").Collection("webhooks").Find(context.Background(), bson.M{})

	if err != nil {
		return nil, err
	}

	var webhooks []Webhook;
	err = cursor.All(context.Background(), &webhooks)
	if err != nil {
		return nil, err
	}

	return webhooks, nil
}

func (repo *MongoWebhookRepo) CreateWebhook(webhook *Webhook) (*Webhook, error) {
	webhook.CreatedAt = time.Now()

	result, err := repo.Client.Database("stackON").Collection("webhooks").InsertOne(context.Background(), webhook)
	webhook.Id = result.InsertedID.(primitive.ObjectID)

	return webhook, err
}

func (repo *MongoWebhookRepo) UpdateWebhook(id string, updated Webhook) (*Webhook, error) {
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	
	_, err = repo.Client.Database("stackON").Collection("webhooks").UpdateOne(context.Background(), bson.M{"_id": objId}, bson.D{{
		Key: "$set",
		Value: bson.D{
			{Key: "type", Value: updated.Type},
			{Key: "topic", Value: updated.Topic},
			{Key: "instructionNodes", Value: updated.InstructionNodes},
			{Key: "instructionConnections", Value: updated.InstructionConnections},
		},
	}})
	
	updatedDocument, err := repo.GetWebhookById(id)
	return updatedDocument, err
}

func (repo *MongoWebhookRepo) DeleteWebhook(id string) (*Webhook, error) {
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var deltedWebhook Webhook
	err = repo.Client.Database("stackON").Collection("webhooks").FindOneAndDelete(context.Background(), bson.M{"_id": objId}).Decode(&deltedWebhook)

	return &deltedWebhook, err
}