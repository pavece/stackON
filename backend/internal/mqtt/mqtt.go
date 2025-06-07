package mqttclient

import (
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var Client mqtt.Client

func InitClient(conUrl string){
	opts := mqtt.NewClientOptions().AddBroker(conUrl)
	opts.SetClientID("stackON-publisher")

	Client = mqtt.NewClient(opts)
	token := Client.Connect();
	
	if token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}
}