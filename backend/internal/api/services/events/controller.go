package eventsservice

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/pavece/stackON/internal/api"
	"github.com/pavece/stackON/internal/db"
	"github.com/pavece/stackON/internal/repositories/event"
	"go.mongodb.org/mongo-driver/mongo"
)

type EventsController struct {
	service *EventService
}

func NewController() *EventsController {
	return &EventsController{service: NewService(&event.MongoEventRepo{Client: db.GetClient()})}
}

func (cont *EventsController) GetEventsController(w http.ResponseWriter, r *http.Request) {
	events, err := cont.service.GetEvents()
	if err == mongo.ErrNoDocuments {
		api.SendJson(w, 200, []interface{}{})
		return
	}

	if err != nil {
		api.SendError(w, 500, "Error while retrieving events")
		return
	}

	api.SendJson(w, 200, events)
}

func (cont *EventsController) GetEventsByHookController(w http.ResponseWriter, r *http.Request) {
	hookId := chi.URLParam(r, "id")

	events, err := cont.service.GetEventsByHook(hookId)
	if err == mongo.ErrNoDocuments {
		api.SendJson(w, 200, []interface{}{})
		return
	}

	if err != nil {
		api.SendError(w, 500, "Error while retrieving events")
		return
	}

	api.SendJson(w, 200, events)
}
