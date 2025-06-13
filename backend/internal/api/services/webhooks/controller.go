package webhookservice

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/pavece/stackON/internal/api"
	"github.com/pavece/stackON/internal/db"
	"github.com/pavece/stackON/internal/repositories/webhook"
	"go.mongodb.org/mongo-driver/mongo"
)

type WebhookController struct {
	service *WebhookService
}

func  NewController() *WebhookController {
	return &WebhookController{service: NewService(&webhook.MongoWebhookRepo{Client: db.GetClient()})}
}



func (cont *WebhookController) GetWebhooksController(w http.ResponseWriter, r *http.Request) {
	result, err := cont.service.GetWebhooks()

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

func (cont *WebhookController) GetWebhookByIdController(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	result, err := cont.service.GetWebhookById(id)
	
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

func (cont *WebhookController) DeleteWebhookController(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	result, err := cont.service.DeleteWebhook(id)
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

func (cont *WebhookController) CreateWebhookController(w http.ResponseWriter, r *http.Request) {
	var fields webhook.Webhook
	err := json.NewDecoder(r.Body).Decode(&fields)

	if err != nil {
		api.SendError(w, 400, "JSON validation error, please include every field in correct JSON format")
		return
	}

	validate := validator.New()
	err = validate.Struct(fields)

	if err != nil {
		var errors string
		for _, e := range err.(validator.ValidationErrors) {
			errors += e.Field() + " is " + e.Tag() + " | "
		}
		api.SendError(w, 400, errors)
		return
	}

	createdWh, err := cont.service.CreateWebhook(&fields)
	if err != nil {
		api.SendError(w, 500, "Error while creating the webhook")
		return
	}

	api.SendJson(w, 201, createdWh)

}

func (cont *WebhookController) UpdateWebhookController(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var fields webhook.Webhook
	err := json.NewDecoder(r.Body).Decode(&fields)

	if err != nil {
		api.SendError(w, 400, "JSON validation error, please include every field in correct JSON format")
		return
	}

	validate := validator.New()
	err = validate.Struct(fields)

	if err != nil {
		var errors string
		for _, e := range err.(validator.ValidationErrors) {
			errors += e.Field() + " is " + e.Tag() + " | "
		}
		api.SendError(w, 400, errors)
		return
	}

	updatedWh, err := cont.service.UpdateWebhook(id, &fields)
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



