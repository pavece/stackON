package event

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoEventRepo struct {
	Client *mongo.Client
}

func (repo *MongoEventRepo) CreateEvent(event *Event) (*Event, error){
	result, err := repo.Client.Database("stackON").Collection("events").InsertOne(context.Background(), event)
	event.Id = result.InsertedID.(primitive.ObjectID)

	return event, err
}

func (repo *MongoEventRepo) GetFiredEvents() ([]Event, error) {
	cursor, err := repo.Client.Database("stackON").Collection("events").Find(context.Background(), bson.M{})

	if err != nil {
		return nil, err
	}

	var events []Event;
	err = cursor.All(context.Background(), &events)
	if err != nil {
		return nil, err
	}

	return events, nil
}

func (repo *MongoEventRepo) GetFiredEventsByWebhook(webhookId string) ([]Event, error) {
	objId, err := primitive.ObjectIDFromHex(webhookId)
	if err != nil {
		return nil, err
	}

	cursor, err := repo.Client.Database("stackON").Collection("events").Find(context.Background(), bson.M{"_id": objId})
	if err != nil {
		return nil, err
	}
	var events []Event;
	err = cursor.All(context.Background(), &events)

	return events, err
}
