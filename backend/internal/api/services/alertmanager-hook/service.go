package alertmanagerhookservice

import (
	"net/http"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/go-chi/chi/v5"
	"github.com/pavece/stackON/internal/api"
	"github.com/pavece/stackON/internal/repositories/webhook"
	"go.mongodb.org/mongo-driver/mongo"
)

type HookService struct {
	repo *webhook.MongoWebhookRepo
	mqttClient mqtt.Client
}

func New(mongoRepo *webhook.MongoWebhookRepo, mqttClient mqtt.Client) *HookService{
	return &HookService{repo: mongoRepo, mqttClient: mqttClient}
}

func (svc *HookService) ForwardEvent(w http.ResponseWriter, r *http.Request){
	webhookId := chi.URLParam(r, "id")
	webhook, err := svc.repo.GetWebhookById(webhookId)

	if err == mongo.ErrNoDocuments {
		api.SendError(w, 404, "Webhook not found")
		return
	}

	svc.mqttClient.Publish("test/topic", 0, false, "Hello from go " + webhookId)
	api.SendJson(w, 200, map[string]interface{}{"webhookId": webhookId, "webhookTopic": webhook.Topic})
}