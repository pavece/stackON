package alertmanagerhookservice

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"slices"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/pavece/stackON/internal/api"
	"github.com/pavece/stackON/internal/repositories/event"
	"github.com/pavece/stackON/internal/repositories/webhook"
	"go.mongodb.org/mongo-driver/mongo"
)

type HookService struct {
	webhookRepo *webhook.MongoWebhookRepo
	eventRepo *event.MongoEventRepo
	mqttClient mqtt.Client
}

type MQTTResponse struct {
	EventId string `json:"eventId"`
	HandleType string `json:"handleType"`
	Instructions []string `json:"instructions"`//TODO: Define the instructions type
	Status string `json:"status"`
}

type MQTTAlertGroup struct {
	Status       string            `json:"status" validate:"required,oneof=firing resolved"`
	CommonLabels map[string]string `json:"commonLabels" validate:"required"`
}

func New(mongoRepo *webhook.MongoWebhookRepo, mqttClient mqtt.Client, eventMongoRepo *event.MongoEventRepo) *HookService{
	return &HookService{webhookRepo: mongoRepo, mqttClient: mqttClient, eventRepo:  eventMongoRepo}
}

func (svc *HookService) ForwardEvent(w http.ResponseWriter, r *http.Request){
	var alertPayload MQTTAlertGroup
	err := json.NewDecoder(r.Body).Decode(&alertPayload)
	
	if err != nil {
		api.SendError(w, 400, "Please include the alert information in prometheus alert manager format")
		return
	}

	webhookId := chi.URLParam(r, "id")
	webhook, err := svc.webhookRepo.GetWebhookById(webhookId)

	if err == mongo.ErrNoDocuments {
		api.SendError(w, 404, "Webhook not found")
		return
	}

	if webhook.Type != "latch" && webhook.Type != "once" {
		api.SendError(w, 400, "Invalid webhook type expected latch or once")
		return
	}

	err = validateMQTTGroup(alertPayload)
	if err != nil {
		api.SendError(w, 400, err.Error())
		return
	}

	eventId := fmt.Sprintf("%s:%s:%s", alertPayload.CommonLabels["alertname"], alertPayload.CommonLabels["instance"], alertPayload.CommonLabels["severity"])
	instructionSet := convertNodesToInstructionSet(webhook.InstructionNodes, webhook.InstructionConnections)

	if alertPayload.Status != "resolve" {
		//Error will be ignored as it's not critical
		svc.eventRepo.CreateEvent(&event.Event{FiredAt: time.Now(), EventId: eventId, WebhookId: webhook.Id})
		
		//TODO: Count fire event with prometheus
	} 

	mqttResponse := MQTTResponse{EventId: eventId, HandleType: webhook.Type, Instructions: instructionSet, Status: alertPayload.Status}
	marshallReponse, err := json.Marshal(mqttResponse)

	if err != nil {
		api.SendError(w, 500, "Error converting JSON response")
		return
	}

	svc.mqttClient.Publish(webhook.Topic, 0, false, marshallReponse)
	api.SendJson(w, 200, mqttResponse)
}

func validateMQTTGroup(alertPayload MQTTAlertGroup) error { 
	validate := validator.New()
	err := validate.Struct(alertPayload)	
	
	if err != nil {
		var errorsDesc string
		for _, e := range err.(validator.ValidationErrors) {
			errorsDesc += e.Field() + " is " + e.Tag() + " | "
		}
		return errors.New(errorsDesc)
	}

	if alertPayload.CommonLabels["alertname"] == "" || alertPayload.CommonLabels["instance"] == "" || alertPayload.CommonLabels["severity"] == "" {
		return errors.New("please include alertname, instance and severity in the commonLabels field")
	}

	return nil
}

func convertNodesToInstructionSet(nodes []webhook.InstructionNode, edges []webhook.InstructionConnection) []string{
	instructionSet := make([]string, 0, 10)

	currentNode := nodes[0].Id

	for len(edges) > 0 {
		currentEdgeIdx := indexOfEdgeByStart(currentNode, edges)
		if(currentEdgeIdx < 0){
			return instructionSet
		}

		instruction, err := findInstructionById(currentNode, nodes)
		if err != nil {
			return instructionSet
		}

		instructionSet = append(instructionSet, instruction.Data.Instruction)
		currentNode = edges[currentEdgeIdx].Target

		edges = slices.Delete(edges, currentEdgeIdx, currentEdgeIdx + 1)	

		if len(edges) < 1 {
			instruction, err := findInstructionById(currentNode, nodes)
			if err != nil {
				return instructionSet
			}

			instructionSet = append(instructionSet, instruction.Data.Instruction)
		}
	}

	return instructionSet
}

func indexOfEdgeByStart(start string, edges []webhook.InstructionConnection) int {
	for i, e := range edges {
		if e.Source == start {
			return i
		}
	}
	return -1
}

func findInstructionById(id string, instructions []webhook.InstructionNode) (webhook.InstructionNode, error){
	for _, in := range instructions {
		if in.Id == id {
			return in, nil
		}
	}

	return webhook.InstructionNode{}, nil
}