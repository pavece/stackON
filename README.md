![Stackon OG image](https://res.cloudinary.com/dnh0go0q2/image/upload/v1749986994/stackon-og_g9a0o4.png)

# StackON

StackON allows you to forward alert events to physical devices using MQTT. Create webhooks, define custom instructions, and control hardware like an ESP32 to bring your homelab alerts to life.

> [!WARNING]  
> This is a simple toy project. Don't expect heavy maintenance or feature updates.

## What is StackON

I have a homelab with a prometheus + alertmanager setup. One day I thought that adding a [stack light / andon beacon](https://en.wikipedia.org/wiki/Stack_light) could be a good idea. I wanted to do this using an ESP32 that reads alerts sent over MQTT. That's why I created this small toy project.

StackON lets you:

- Create webhooks to receive Alertmanager payloads

- Attach instruction sets (e.g., GPIO actions) to those webhooks

- Forward them over MQTT to your devices (like an ESP32)

Each webhook can have a custom instruction sequence, so different alerts trigger different behaviors.

## Installing

StackON depends on [MongoDB](https://www.mongodb.com/) and [Mosquitto](https://mosquitto.org/). You can run everything with Docker Compose. However, it’s strongly recommended to run MongoDB and Mosquitto independently.

### Example docker compose

```yaml
services:
   app:
    image: [UPDATE TO PUBLIC DOCKER IMAGE]
    environment:
      PORT: 3000
      MONGO_CONNECTION_URL: mongodb://root:root@mongodb:27017
      MQTT_BROKER_URL: tcp://mosquitto:1883
      MCP_PORT: 3001 # MCP server endpoint = /mcp
      MCP_ENABLED: true
    networks:
      - backend
    ports:
      - 8080:3000
      - 8081:3001 #MCP server

  # Prerequisites
  mongodb:
    image: mongo:7-jammy
    container_name: mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
    volumes:
      - ./mongo-data:/data/db
    networks:
      - backend

  mosquitto:
    image: eclipse-mosquitto
    ports:
      - '1883:1883'
    volumes:
      - ./mosquitto_config:/mosquitto/config:rw
    networks:
      - backend

networks:
  backend:
```

#### Mosquitto Config (for testing)

Add this to mosquitto.conf:

```conf
allow_anonymous true
listener 1883
```

### Building from source

You can clone the repository and build the docker image. It's a multistage image that will build and serve both client and server.

The docker compose included in the repo will automatically build the image. If you just want to test the app then clone the repo and run docker compose up (remember to configure mosquitto).

## Configuring Alertmanager

StackON webhook expect to receive a payload including these fields, alertmanager will send more fields but StackON will ignore them:

```json
{
	"status": "firing",
	"commonLabels": {
		"alertname": "HighCPUUsage",
		"instance": "server1",
		"severity": "warning"
	}
}
```

If one of these fields is missing StackON wont be able to forward it.

### Recommended configuration

Alertmanager groups alerts based on different properties for example: by name or severity. I personally like to use as least grouping as possible. So each webhook call represents an alert.

You also want to route alerts to different webhooks based on severity. Remember that each webhook can only send one set of instructions. So you want one webhook for each severity level.

```yaml
global:
  resolve_timeout: 30s

route:
  receiver: so-default-receiver
  group_by: ['...']
  group_interval: 1m
  repeat_interval: 1h #Important, specially for latch hooks
  group_wait: 30s
  routes:
    - match:
        severity: warning
      receiver: so-warning-webhook

    - match:
        severity: error
      receiver: so-error-webhook
receivers:
  - name: so-warning-webhook
    webhook_configs:
      - url: 'WARNING WEBHOOK URL'
        send_resolved: true
  - name: so-error-webhook
    webhook_configs:
      - url: 'ERROR WEBHOOK URL'
      send_resolved: true

  - name: so-default-receiver
    webhook_configs:
      - url: 'DEFAULT WEBHOOK URL'
      send_resolved: true
```

You can use this sample alertmanager configuration. As you can see it will route alerts to different webhooks based on severity. **Remember to include send_resolved if you want to use latch hooks.**

## MQTT clients

StackON will send MQTT messages with this payload:

```json
{
	"eventId": "alertname:server:severity",
	"handleType": "latch",
	"instructions": ["ON:RED", "WAIT:10", "OFF:RED"],
	"status": "resolved"
}
```

You can listen to these messages using devices like [ESP32](https://en.wikipedia.org/wiki/ESP32) just connect to the broker and subscribe to the topic specified in the webhooks you want to capture with this device.

Some important considerations:

- Instructions are sent as **[]string** where each string has the format **command:value**, the value can be anything. In this case is a color but it could be a GPIO pin number. As the user you can input any value in the diagram editor.
- handleType can be **once** or **latch**, actions fired by a latch hook should only end when you receive status as **resolved** and the same event id. Once hooks should execute the instruction set only once.

### ESP32 client example

You can view the source code for my ESP32 andon / stack beacon implementation
[ESP32 StackON Client](https://github.com/pavece/stackON/tree/main/beacon-clients/esp32).

It’s a basic starting point — feel free to build your own version to suit your needs.

### The MCP server

StackON includes a very simple MCP server that allows webhook and event history information retrieval. If you want to use it include the MCP_PORT and ENABLE_MCP variables as shown in the compose example.

Then you can add the MCP server into tools like Claude desktop or VsCode Copilot chat using this url:

```txt
 http://<host>:<mcp-port>/mcp
```
