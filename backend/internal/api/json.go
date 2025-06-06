package api

import (
	"encoding/json"
	"log"
	"net/http"
)

func SendJson(w http.ResponseWriter, code int, payload interface{}){
	data, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(500)
		log.Fatal("Cannot marshall a json value: ", err)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(data)
}

func SendError(w http.ResponseWriter, code int, message string){
	type errorResponse struct{
		Message string `json:"message"`
	}

	SendJson(w, code, errorResponse{
		Message: message,
	})
}