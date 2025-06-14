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

type NodeData struct {
	Label string `bson:"label" json:"label"`
	Instruction string `bson:"instruction" json:"instruction"`
	InstructionValue string `bson:"instructionValue" json:"instructionValue"`
	InstructionType string `bson:"instructionType" json:"instructionType"`
}

type InstructionNode struct {
	Id    	 string `bson:"id" json:"id"`
	Type  	 string `bson:"type" json:"type"`
	Data   	 NodeData `bson:"data" json:"data"`
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
	Title				   string				  `bson:"title" json:"title" validate:"required"`
	Description			   string				  `bson:"description" json:"description" validate:"required"`
	Type                   string                 `bson:"type" json:"type" validate:"required"`
	Topic                  string                 `bson:"topic" json:"topic" validate:"required"`
	InstructionNodes       []InstructionNode      `bson:"instructionNodes" json:"instructionNodes" validate:"required,dive"`
	InstructionConnections []InstructionConnection `bson:"instructionConnections" json:"instructionConnections" validate:"required,dive"`
	CreatedAt              time.Time              `bson:"createdAt,omitempty" json:"createdAt"`
}

type WebhookReduced struct {
	Id                     primitive.ObjectID     `bson:"_id,omitempty" json:"id"`
	Title				   string				  `bson:"title" json:"title" validate:"required"`
	Description			   string				  `bson:"description" json:"description" validate:"required"`
	Type                   string                 `bson:"type" json:"type" validate:"required"`
	Topic                  string                 `bson:"topic" json:"topic" validate:"required"`
	CreatedAt              time.Time              `bson:"createdAt,omitempty" json:"createdAt"`
}

type WebhookRepository interface {
	GetWebhookById(id string) (*Webhook, error)
	GetWebhooks() ([]Webhook, error)
	CreateWebhook(webhook *Webhook) (*Webhook, error)
	UpdateWebhook(id string, updated Webhook) (*Webhook, error)
	DeleteWebhook(id string) (*Webhook, error)
}