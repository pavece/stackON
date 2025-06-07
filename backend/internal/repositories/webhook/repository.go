package webhook

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Needs review
type Position struct {
    X float64 `bson:"x" json:"x"`
    Y float64 `bson:"y" json:"y"`
}

type InstructionNode struct {
	Id    	 string `bson:"id" json:"id"`
	Type  	 string `bson:"type" json:"type"`
	Data  	 interface{} `bson:"data" json:"data"`
	Position Position `bson:"position" json:"position"`
}

type InstructionConnection struct {
	Id 		string `bson:"id" json:"id"`
	Type  	string `bson:"type" json:"type"`
	Source  string `bson:"soruce" json:"source"`
	Target  string `bson:"target" json:"target"`
}

type Webhook struct {
	Id                     primitive.ObjectID     `bson:"_id,omitempty" json:"id"`
	Type                   string                 `bson:"type" json:"type" validate:"required"`
	Topic                  string                 `bson:"topic" json:"topic" validate:"required"`
	InstructionNodes       []InstructionNode      `bson:"instructionNodes" json:"instructionNodes" validate:"required,dive"`
	InstructionConnections []InstructionConnection `bson:"instructionConnections" json:"instructionConnections" validate:"required,dive"`
	CreatedAt              time.Time              `bson:"createdAt,omitempty" json:"createdAt"`
}
type WebhookRepository interface {
	GetWebhookById(id string) (*Webhook, error)
	GetWebhooks() ([]Webhook, error)
	CreateWebhook(webhook *Webhook) (*Webhook, error)
	UpdateWebhook(id string, updated Webhook) (*Webhook, error)
	DeleteWebhook(id string) (*Webhook, error)
}