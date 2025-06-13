package eventsservice

import (
	"github.com/pavece/stackON/internal/repositories/event"
)

type EventService struct {
	Repo *event.MongoEventRepo
}

func NewService(repo *event.MongoEventRepo) (*EventService){
	return &EventService{Repo: repo}
}

func (svc *EventService) GetEvents() ([]event.Event, error){
	events, err := svc.Repo.GetFiredEvents()
	return events, err
}

func (svc *EventService) GetEventsByHook(hookId string) ([]event.Event, error){
	events, err := svc.Repo.GetFiredEventsByWebhook(hookId)
	return events, err
}
