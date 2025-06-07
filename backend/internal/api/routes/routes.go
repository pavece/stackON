package routes

import (
	"github.com/go-chi/chi/v5"
	webhookservice "github.com/pavece/stackON/internal/api/services/webhooks"
	"github.com/pavece/stackON/internal/db"
	"github.com/pavece/stackON/internal/repositories/webhook"
)

func MountRoutes(router *chi.Mux) {
	webhookService := webhookservice.NewWebhookService(&webhook.MongoWebhookRepo{Client: db.GetClient()})
	webhooksRouter := chi.NewRouter()

	webhooksRouter.Get("/", webhookService.GetWebhooks)
	webhooksRouter.Get("/{id}", webhookService.GetWebhookById)
	webhooksRouter.Delete("/{id}", webhookService.DeleteWebhook)
	webhooksRouter.Post("/", webhookService.CreateWebhook)
	webhooksRouter.Patch("/{id}", webhookService.UpdateWebhook)

	router.Mount("/webhooks", webhooksRouter)
}