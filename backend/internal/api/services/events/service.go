package eventsservice

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/pavece/stackON/internal/api"
	"github.com/pavece/stackON/internal/repositories/event"
	"go.mongodb.org/mongo-driver/mongo"
)

type EventService struct {
	Repo *event.MongoEventRepo
}

func New(repo *event.MongoEventRepo) (*EventService){
	return &EventService{Repo: repo}
}

func (svc *EventService) GetEvents(w http.ResponseWriter, r *http.Request){
	events, err := svc.Repo.GetFiredEvents()
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

func (svc *EventService) GetEventsByHook(w http.ResponseWriter, r *http.Request){
	hookId := chi.URLParam(r, "id")
	
	events, err := svc.Repo.GetFiredEventsByWebhook(hookId)
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
