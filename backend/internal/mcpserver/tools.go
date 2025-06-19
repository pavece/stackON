package mcpserver

import (
	"context"
	"encoding/json"
	"time"

	"github.com/mark3labs/mcp-go/mcp"
	eventsservice "github.com/pavece/stackON/internal/api/services/events"
	webhookservice "github.com/pavece/stackON/internal/api/services/webhooks"
	"github.com/pavece/stackON/internal/db"
	"github.com/pavece/stackON/internal/repositories/event"
	"github.com/pavece/stackON/internal/repositories/webhook"
	"github.com/pavece/stackON/internal/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DetailedWebhookResponse struct {
	Id                     primitive.ObjectID     `bson:"_id,omitempty" json:"id"`
	Title				   string				  `bson:"title" json:"title" validate:"required"`
	Description			   string				  `bson:"description" json:"description" validate:"required"`
	Type                   string                 `bson:"type" json:"type" validate:"required"`
	Topic                  string                 `bson:"topic" json:"topic" validate:"required"`
	Instructions      	   []string      		  `json:"instructions"`
	CreatedAt              time.Time              `bson:"createdAt,omitempty" json:"createdAt"`
}


type MCPTools struct {
	webhookService *webhookservice.WebhookService
	eventsService *eventsservice.EventService
}

func NewTools() *MCPTools{
	return &MCPTools{
		webhookService: webhookservice.NewService(&webhook.MongoWebhookRepo{Client: db.GetClient()}),
		eventsService: eventsservice.NewService(&event.MongoEventRepo{Client: db.GetClient()}),
	}
}

func (tools *MCPTools) getWebhooks(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	webhooks, err := tools.webhookService.GetWebhooks()
	
	if err != nil {
		return mcp.NewToolResultError("Failed to retrieve webhooks"), nil
	}

	reducedWebhooks := make([]webhook.WebhookReduced, 0, len(webhooks))
	for _, wh := range webhooks {
		reducedWebhooks = append(reducedWebhooks, webhook.WebhookReduced{Id: wh.Id, Title: wh.Title, Description: wh.Description, Type: wh.Type, CreatedAt: wh.CreatedAt})
	}

	jsonData, err := json.Marshal(reducedWebhooks)
	if err != nil {
		return mcp.NewToolResultError("Failed to marshall JSON response"), nil
	}

	return mcp.NewToolResultText(string(jsonData)), nil
}

func (tools *MCPTools) getWebhookById(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	webhookId, err := request.RequireString("webhookId")
	if err != nil {
		return mcp.NewToolResultError("Webhook ID not included"), nil
	}
	
	webhook, err := tools.webhookService.GetWebhookById(webhookId)
	if err != nil {
		return mcp.NewToolResultError("Failed to retrieve webhook"), nil
	}

	responseWebhok := DetailedWebhookResponse{Id: webhook.Id, Title: webhook.Title, Description: webhook.Description, Type: webhook.Type, Topic: webhook.Topic, CreatedAt: webhook.CreatedAt}
	responseWebhok.Instructions = utils.ConvertNodesToInstructionSet(webhook.InstructionNodes, webhook.InstructionConnections)

	jsonData, err := json.Marshal(responseWebhok)
	if err != nil {
		return mcp.NewToolResultError("Failed to marshall JSON response"), nil
	}

	return mcp.NewToolResultText(string(jsonData)), nil
}

func (tools *MCPTools) deleteWebhook(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	webhookId, err := request.RequireString("webhookId")
	if err != nil {
		return mcp.NewToolResultError("Webhook ID not included"), nil
	}
	
	webhook, err := tools.webhookService.DeleteWebhook(webhookId)
	if err != nil {
		return mcp.NewToolResultError("Failed to delete webhook"), nil
	}

	responseWebhok := DetailedWebhookResponse{Id: webhook.Id, Title: webhook.Title, Description: webhook.Description, Type: webhook.Type, Topic: webhook.Topic, CreatedAt: webhook.CreatedAt}
	responseWebhok.Instructions = utils.ConvertNodesToInstructionSet(webhook.InstructionNodes, webhook.InstructionConnections)

	jsonData, err := json.Marshal(responseWebhok)
	if err != nil {
		return mcp.NewToolResultError("Failed to marshall JSON response"), nil
	}

	return mcp.NewToolResultText(string(jsonData)), nil
}


func (tools *MCPTools) getEvents(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	events, err := tools.eventsService.GetEvents()
	if err != nil {
		return mcp.NewToolResultError("Failed to retrieve events"), nil
	}

	jsonData, err := json.Marshal(events)
	if err != nil {
		return mcp.NewToolResultError("Failed to marshall JSON response"), nil
	}

	return mcp.NewToolResultText(string(jsonData)), nil
}

func (tools *MCPTools) getEventsByWebhook(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	webhookId, err := request.RequireString("webhookId")
	if err != nil {
		return mcp.NewToolResultError("Webhook ID not included"), nil
	}

	events, err := tools.eventsService.GetEventsByHook(webhookId)

	if err != nil {
		return mcp.NewToolResultError("Failed to retrieve events"), nil
	}

	jsonData, err := json.Marshal(events)
	if err != nil {
		return mcp.NewToolResultError("Failed to marshall JSON response"), nil
	}

	return mcp.NewToolResultText(string(jsonData)), nil 
}