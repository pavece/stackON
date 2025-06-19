package emptyhookservice

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/go-chi/chi/v5"
	"github.com/pavece/stackON/internal/api"
	"github.com/pavece/stackON/internal/repositories/event"
	"github.com/pavece/stackON/internal/repositories/webhook"
	"github.com/pavece/stackON/internal/utils"
	"go.mongodb.org/mongo-driver/mongo"
)

type HookService struct {
	webhookRepo *webhook.MongoWebhookRepo
	eventRepo *event.MongoEventRepo
	mqttClient mqtt.Client
}

type MQTTResponse struct {
	EventId string `json:"eventId"`
	HandleType string `json:"handleType"`
	Instructions []string `json:"instructions"`
	Status string `json:"status"`
}

// An empty webhook expects no request body
// It's only valid for "once" hooks and won't provide any information regarding the calling reason

func New(mongoRepo *webhook.MongoWebhookRepo, mqttClient mqtt.Client, eventMongoRepo *event.MongoEventRepo) *HookService{
	return &HookService{webhookRepo: mongoRepo, mqttClient: mqttClient, eventRepo:  eventMongoRepo}
}

func (svc *HookService) ForwardEvent(w http.ResponseWriter, r *http.Request){
	webhookId := chi.URLParam(r, "id")
	webhook, err := svc.webhookRepo.GetWebhookById(webhookId)

	if err == mongo.ErrNoDocuments {
		api.SendError(w, 404, "Webhook not found")
		return
	}

	if webhook.Type != "once" {
		api.SendError(w, 400, "Empty webhooks calls can only be made against once hooks")
		return
	}

	eventId := fmt.Sprintf("empty:%s:empty", webhookId)
	instructionSet := utils.ConvertNodesToInstructionSet(webhook.InstructionNodes, webhook.InstructionConnections)

	svc.eventRepo.CreateEvent(&event.Event{FiredAt: time.Now(), EventId: eventId, WebhookId: webhook.Id, Status: "firing"})

	mqttResponse := MQTTResponse{EventId: eventId, HandleType: webhook.Type, Instructions: instructionSet, Status: "firing"}
	marshallReponse, err := json.Marshal(mqttResponse)

	if err != nil {
		api.SendError(w, 500, "Error converting JSON response")
		return
	}

	svc.mqttClient.Publish(webhook.Topic, 0, false, marshallReponse)
	api.SendJson(w, 200, mqttResponse)
}
