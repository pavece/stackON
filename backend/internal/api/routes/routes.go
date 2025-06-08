package routes

import (
	"github.com/go-chi/chi/v5"
	alertmanagerhookservice "github.com/pavece/stackON/internal/api/services/alertmanager-hook"
	webhookservice "github.com/pavece/stackON/internal/api/services/webhooks"
	"github.com/pavece/stackON/internal/db"
	mqttclient "github.com/pavece/stackON/internal/mqtt"
	"github.com/pavece/stackON/internal/repositories/webhook"
)

func MountRoutes(router *chi.Mux) {
	webhookService := webhookservice.New(&webhook.MongoWebhookRepo{Client: db.GetClient()})
	webhooksRouter := chi.NewRouter()

	webhooksRouter.Get("/", webhookService.GetWebhooks)
	webhooksRouter.Get("/{id}", webhookService.GetWebhookById)
	webhooksRouter.Delete("/{id}", webhookService.DeleteWebhook)
	webhooksRouter.Post("/", webhookService.CreateWebhook)
	webhooksRouter.Patch("/{id}", webhookService.UpdateWebhook)

	hookRouter := chi.NewRouter()

	//Prometheus alert manager specific
	amHookService := alertmanagerhookservice.New(&webhook.MongoWebhookRepo{Client: db.GetClient()}, mqttclient.Client)
	hookRouter.Get("/am/{id}", amHookService.ForwardEvent)

	//More services (grafana, pagerduty ...)

	router.Mount("/hook", hookRouter)
	router.Mount("/api/webhooks", webhooksRouter)
}