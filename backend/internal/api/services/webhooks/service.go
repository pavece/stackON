package webhookservice

import (
	"net/http"

	"github.com/pavece/stackON/internal/api"
	"github.com/pavece/stackON/internal/repositories/webhook"
)

type WebhookService struct {
	Repo *webhook.MongoWebhookRepo
}

func NewWebhookService(mongoRepo *webhook.MongoWebhookRepo) *WebhookService{
	return &WebhookService{Repo: mongoRepo}
}

func (svc *WebhookService) TestController(w http.ResponseWriter, r *http.Request) {
	svc.Repo.GetWebhookById("abc")

	api.SendJson(w, 201, map[string]string{"message": "Hello from webhook service"})
}