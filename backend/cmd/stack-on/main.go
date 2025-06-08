package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"github.com/pavece/stackON/internal/api/routes"
	"github.com/pavece/stackON/internal/db"
	mqttclient "github.com/pavece/stackON/internal/mqtt"
)


func main() {

	//Load and check env variables
	godotenv.Load()
	port := os.Getenv("PORT")
	dbConUrl := os.Getenv("MONGO_CONNECTION_URL")
	mqttBrokerUrl := os.Getenv("MQTT_BROKER_URL")

	if port == "" {
		port = "3000"
	}

	if dbConUrl == "" {
		log.Fatal("[ERROR] Database connection URL must be defined in env variables")
	}

	if mqttBrokerUrl == "" {
		log.Fatal("[ERROR] MQTT broker url must be defined in env variables")
	}

	//Setup mongo db
	db.Start(dbConUrl)

	//Setup mqtt
	mqttclient.InitClient(mqttBrokerUrl)

	//Setup http server + chi
	chiRouter := chi.NewRouter()

	routes.MountRoutes(chiRouter)

	httpServer := &http.Server{
		Handler: chiRouter,
		Addr: ":"+port,
	}

	fmt.Println("[INFO] Server running on port " + port)

	err := httpServer.ListenAndServe()
	if err != nil {
		log.Fatal("[ERROR] HTTP server error", err)
	}
}