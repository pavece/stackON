package event

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Event struct {
	Id        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FiredAt   time.Time          `bson:"firedAt" json:"firedAt"`
	EventId   string			 `bson:"eventId" json:"eventId"`
	WebhookId primitive.ObjectID `bson:"webhookId" json:"webhookId"`
	Status 	  string `bson:"status" json:"status"`
}
