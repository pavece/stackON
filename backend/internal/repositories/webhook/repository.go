package webhook

import "time"

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
	Id    					string `bson:"_id,omitempty" json:"id"`
	Type  					string `bson:"type" json:"type"`
	Topic 					string `bson:"topic" json:"topic"`
	InstructionNodes 		[]InstructionNode `bson:"instructionNodes" json:"instructionNodes"`
	InstructionConnections  []InstructionConnection `bson:"instructionConnections" json:"instructionConnections"`
	CreatedAt				time.Time `bson:"createdAt,omitempty" json:"createdAt"`
}

type DTOWebhook struct {
	Type  					string `bson:"type" json:"type"`
	Topic 					string `bson:"topic" json:"topic"`
	InstructionNodes 		[]InstructionNode `bson:"instructionNodes" json:"instructionNodes"`
	InstructionConnections  []InstructionConnection `bson:"instructionConnections" json:"instructionConnections"`
	// CreatedAt				time.Time `bson:"createdAt,omitempty" json:"createdAt"`
}

type WebhookRepository interface {
	GetWebhookById(id string) Webhook
	GetWebhooks() []Webhook
	CreateWebhook(webhook Webhook) Webhook
	UpdateWebhook(id string, updated Webhook) Webhook
	DeleteWebhook(id string) Webhook
}