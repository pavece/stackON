package routes

import (
	"github.com/go-chi/chi/v5"
	alertmanagerhookservice "github.com/pavece/stackON/internal/api/services/alertmanager-hook"
	emptyhookservice "github.com/pavece/stackON/internal/api/services/empty-hook"
	eventsservice "github.com/pavece/stackON/internal/api/services/events"
	webhookservice "github.com/pavece/stackON/internal/api/services/webhooks"
	"github.com/pavece/stackON/internal/db"
	mqttclient "github.com/pavece/stackON/internal/mqtt"
	"github.com/pavece/stackON/internal/repositories/event"
	"github.com/pavece/stackON/internal/repositories/webhook"
)

func MountRoutes(router *chi.Mux) {
	//Webhook management
	webhooksController := webhookservice.NewController()
	webhooksRouter := chi.NewRouter()

	webhooksRouter.Get("/", webhooksController.GetWebhooksController)
	webhooksRouter.Get("/{id}", webhooksController.GetWebhookByIdController)
	webhooksRouter.Delete("/{id}", webhooksController.DeleteWebhookController)
	webhooksRouter.Post("/", webhooksController.CreateWebhookController)
	webhooksRouter.Put("/{id}", webhooksController.UpdateWebhookController)

	//Fired event history
	eventsController := eventsservice.NewController()
	eventRouter := chi.NewRouter()

	eventRouter.Get("/", eventsController.GetEventsController)
	eventRouter.Get("/hook/{id}", eventsController.GetEventsByHookController)

	//Hooks
	hookRouter := chi.NewRouter()

	//Prometheus alert manager specific (controller is service not intended to be called in any other way that's not an HTTP request)
	amHookService := alertmanagerhookservice.New(&webhook.MongoWebhookRepo{Client: db.GetClient()}, mqttclient.Client, &event.MongoEventRepo{Client: db.GetClient()})
	hookRouter.Post("/am/{id}", amHookService.ForwardEvent)

	//Empty hook specific
	emptyHookService := emptyhookservice.New(&webhook.MongoWebhookRepo{Client: db.GetClient()}, mqttclient.Client, &event.MongoEventRepo{Client: db.GetClient()})
	hookRouter.Post("/empty/{id}", emptyHookService.ForwardEvent)
	hookRouter.Get("/empty/{id}", emptyHookService.ForwardEvent)

	//More services (grafana, pagerduty ...)
	router.Mount("/hook", hookRouter)
	router.Mount("/api/webhooks", webhooksRouter)
	router.Mount("/api/events", eventRouter)
}