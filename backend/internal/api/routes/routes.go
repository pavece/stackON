package routes

import (
	"github.com/go-chi/chi/v5"
	alertmanagerhookservice "github.com/pavece/stackON/internal/api/services/alertmanager-hook"
	eventsservice "github.com/pavece/stackON/internal/api/services/events"
	webhookservice "github.com/pavece/stackON/internal/api/services/webhooks"
	"github.com/pavece/stackON/internal/db"
	mqttclient "github.com/pavece/stackON/internal/mqtt"
	"github.com/pavece/stackON/internal/repositories/event"
	"github.com/pavece/stackON/internal/repositories/webhook"
)

func MountRoutes(router *chi.Mux) {
	//Webhook management
	webhookService := webhookservice.New(&webhook.MongoWebhookRepo{Client: db.GetClient()})
	webhooksRouter := chi.NewRouter()

	webhooksRouter.Get("/", webhookService.GetWebhooks)
	webhooksRouter.Get("/{id}", webhookService.GetWebhookById)
	webhooksRouter.Delete("/{id}", webhookService.DeleteWebhook)
	webhooksRouter.Post("/", webhookService.CreateWebhook)
	webhooksRouter.Put("/{id}", webhookService.UpdateWebhook)

	//Fired event history
	eventService := eventsservice.New(&event.MongoEventRepo{Client: db.GetClient()})
	eventRouter := chi.NewRouter()

	eventRouter.Get("/", eventService.GetEvents)
	eventRouter.Get("/hook/{id}", eventService.GetEventsByHook)

	//Hooks
	hookRouter := chi.NewRouter()

	//Prometheus alert manager specific
	amHookService := alertmanagerhookservice.New(&webhook.MongoWebhookRepo{Client: db.GetClient()}, mqttclient.Client, &event.MongoEventRepo{Client: db.GetClient()})
	hookRouter.Post("/am/{id}", amHookService.ForwardEvent)

	//More services (grafana, pagerduty ...)
	router.Mount("/hook", hookRouter)
	router.Mount("/api/webhooks", webhooksRouter)
	router.Mount("/api/events", eventRouter)
}