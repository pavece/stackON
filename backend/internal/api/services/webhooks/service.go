package webhookservice

import (
	"github.com/pavece/stackON/internal/repositories/webhook"
)

type WebhookService struct {
	Repo *webhook.MongoWebhookRepo
}

func NewService(mongoRepo *webhook.MongoWebhookRepo) *WebhookService{
	return &WebhookService{Repo: mongoRepo}
}

func (svc *WebhookService) GetWebhooks() ([]webhook.Webhook, error) {
	result, err := svc.Repo.GetWebhooks()
	return result, err;
}

func (svc *WebhookService) GetWebhookById(id string) (*webhook.Webhook, error){
	result, err := svc.Repo.GetWebhookById(id)
	return result, err
}

func (svc *WebhookService) DeleteWebhook(id string) (*webhook.Webhook, error){
	result, err := svc.Repo.DeleteWebhook(id)
	return result, err
}

func (svc *WebhookService) CreateWebhook(fields *webhook.Webhook) (*webhook.Webhook, error){
	createdWh, err := svc.Repo.CreateWebhook(fields)
	return createdWh, err	
}


func (svc *WebhookService) UpdateWebhook(id string, updates *webhook.Webhook) (*webhook.Webhook, error){
	updatedWh, err := svc.Repo.UpdateWebhook(id, updates)
	return updatedWh, err
}