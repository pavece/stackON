package webhookservice

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/pavece/stackON/internal/api"
	"github.com/pavece/stackON/internal/repositories/webhook"
	"go.mongodb.org/mongo-driver/mongo"
)

type WebhookService struct {
	Repo *webhook.MongoWebhookRepo
}

func New(mongoRepo *webhook.MongoWebhookRepo) *WebhookService{
	return &WebhookService{Repo: mongoRepo}
}


func (svc *WebhookService) GetWebhooks(w http.ResponseWriter, r *http.Request) {
	result, err := svc.Repo.GetWebhooks()
	if err == mongo.ErrNoDocuments {
		api.SendJson(w, 200, map[string]interface{}{
			"webhooks": []interface{}{},
		})
		return
	}

	if err != nil {
		log.Println(err)
		api.SendError(w, 500, "Server error")
		return
	}

	api.SendJson(w, 200, result)
}

func (svc *WebhookService) GetWebhookById(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	result, err := svc.Repo.GetWebhookById(id)
	if err == mongo.ErrNoDocuments {
		api.SendError(w, 404, "Webhook not found")
		return
	}

	if err != nil {
		log.Println(err)
		api.SendError(w, 500, "Server error")
		return
	}

	api.SendJson(w, 200, result)
}

func (svc *WebhookService) DeleteWebhook(w http.ResponseWriter, r *http.Request){
	id := chi.URLParam(r, "id")

	result, err := svc.Repo.DeleteWebhook(id)
	if err == mongo.ErrNoDocuments {
		api.SendError(w, 404, "Webhook not found")
		return
	}

	if err != nil {
		log.Println(err)
		api.SendError(w, 500, "Server error")
		return
	}

	api.SendJson(w, 200, result)
}

func (svc *WebhookService) CreateWebhook(w http.ResponseWriter, r *http.Request){
	var fields webhook.Webhook
	err := json.NewDecoder(r.Body).Decode(&fields)

	if err != nil {
		api.SendError(w, 401, "JSON validation error, please include every field in correct JSON format")
		return
	}

	validate := validator.New()
	err = validate.Struct(fields)

	if err != nil {
		var errors string
		for _, e := range err.(validator.ValidationErrors) {
			errors += e.Field() + " is " + e.Tag() + " | "
		}
		api.SendError(w, 401, errors)
		return
	}

	createdWh, err := svc.Repo.CreateWebhook(&fields)
	if err != nil {
		api.SendError(w, 500, "Error while creating the webhook")
		return
	}

	api.SendJson(w, 201, createdWh)
}


func (svc *WebhookService) UpdateWebhook(w http.ResponseWriter, r *http.Request){
	id := chi.URLParam(r, "id")

	var fields webhook.Webhook
	err := json.NewDecoder(r.Body).Decode(&fields)

	if err != nil {
		api.SendError(w, 401, "JSON validation error, please include every field in correct JSON format")
		return
	}

	validate := validator.New()
	err = validate.Struct(fields)

	if err != nil {
		var errors string
		for _, e := range err.(validator.ValidationErrors) {
			errors += e.Field() + " is " + e.Tag() + " | "
		}
		api.SendError(w, 401, errors)
		return
	}

	updatedWh, err := svc.Repo.UpdateWebhook(id, &fields)
	if err == mongo.ErrNoDocuments {
		api.SendError(w, 404, "Webhook not found")
		return
	}

	if err != nil {
		api.SendError(w, 500, "Error while updating the webhook")
		return
	}

	api.SendJson(w, 201, updatedWh)
}