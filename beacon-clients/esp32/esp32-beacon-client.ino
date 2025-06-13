#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <String.h>
#include <deque>
#include <sstream>
#include <vector>

#define BUILTIN_LED 2

//true = Green light stays on while no alert is active
#define USE_OK_BEACON true

//Messages and commands
struct Message {
  std::string eventId;
  std::string handleType;
  std::vector<std::string> instructions;
  std::string status;
};

std::deque<Message> messageQueue;
SemaphoreHandle_t queueMutex;

std::unordered_map<std::string, int> pinMap;

// MQTT and WIFI
const char* ssid = "";
const char* password = "";
const char* mqtt_server = "";
const int mqttPort = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void confirmationSequence(){
  digitalWrite(pinMap["GREEN"], 1);
  delay(500);
  digitalWrite(pinMap["YELLOW"], 1);
  delay(500);
  digitalWrite(pinMap["RED"], 1);
  delay(500);
  digitalWrite(pinMap["RED"], 0);
  delay(500);
  digitalWrite(pinMap["YELLOW"], 0);
  delay(500);
  digitalWrite(pinMap["GREEN"], 0);
}

void setup_wifi() {
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting to WIFI...");
    delay(500);
  }
}

void connect_mqtt() {
  while (!client.connected()) {
    Serial.println("Connecting to MQTT broker");

    if (client.connect("ESP32Client")) {
      Serial.println("Connected to MQTT borker !");
      confirmationSequence();
      client.subscribe("esp/beacon");
    } else {
      Serial.println(client.state());
      delay(5000);
    }
  }
}

//Helper functions
bool jsonToMessageStruct(const char* jsonStr, Message &m) {
    StaticJsonDocument<512> doc;
    auto error = deserializeJson(doc, jsonStr);
    if (error) return false;

    m.eventId = doc["eventId"] | "";
    m.handleType = doc["handleType"] | "";
    m.status = doc["status"] | "";

    m.instructions.clear();
    for (const auto& instr : doc["instructions"].as<JsonArray>()) {
        m.instructions.push_back(instr.as<const char*>());
    }

    return true;
}

bool removeMessageFromQueue(const std::string messageId, std::deque<Message>& q) {
  for (auto it = q.begin(); it != q.end(); ++it) {
    if (it->eventId == messageId) {
        q.erase(it);
        return true;
    }
  }
  return false;
}

int getColorPin(const std::string color){
  if(!pinMap.contains(color)){
    return 2; //Builtin pin
  }else{
    return pinMap[color];
  }
}

void executeInstruction(std::string instruction){
  //Instruction format command:value
  std::vector<std::string> parts;
  std::istringstream ss(instruction);
  std::string token;

  while (std::getline(ss, token, ':')) {
    parts.push_back(token);
  }

  const std::string command = parts[0];
  const std::string value = parts[1];

  if(command == "WAIT"){
    vTaskDelay((std::stoi(value) * 1000) / portTICK_PERIOD_MS);
  }else if(command == "ON"){
    digitalWrite(getColorPin(value), 1);
  }else if(command == "OFF"){
    digitalWrite(getColorPin(value), 0);
  }
}

void MQTTCallback(char* topic, byte* payload, unsigned int length) {
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0'; 

  Message newMessage;
  if (jsonToMessageStruct(message, newMessage) && xSemaphoreTake(queueMutex, portMAX_DELAY)) {
    if(newMessage.status=="resolved"){
      removeMessageFromQueue(newMessage.eventId, messageQueue);
    }else{
      messageQueue.push_back(newMessage);
    }
    xSemaphoreGive(queueMutex);
  }
}

void MessageListenerTaskFunction(void *pvParameters){
  setup_wifi();
  client.setServer(mqtt_server, mqttPort);
  client.setCallback(MQTTCallback);

  while (true){
    if(!client.connected()){
      connect_mqtt();
    }
    client.loop();
  }
}

void InstructionExecutorTaskFunction(void *pvParameters){
  while(true){
    if(xSemaphoreTake(queueMutex, portMAX_DELAY)){
      if(!messageQueue.empty()){
        digitalWrite(pinMap["GREEN"], 0);
        Message currentMessage = messageQueue.front();

        for(const std::string& instr : currentMessage.instructions){
          executeInstruction(instr);
        }

        if(currentMessage.handleType == "once"){
          messageQueue.pop_front();
        }  
      }
      xSemaphoreGive(queueMutex);
    }

    if(USE_OK_BEACON){
      digitalWrite(pinMap["GREEN"], 1);
    }

    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}

void setup() {
  Serial.begin(115200);

  pinMap["RED"] = 14;
  pinMap["YELLOW"] = 13;
  pinMap["GREEN"] = 12;

  pinMode(pinMap["RED"], OUTPUT);
  pinMode(pinMap["YELLOW"], OUTPUT);
  pinMode(pinMap["GREEN"], OUTPUT);
  pinMode(BUILTIN_LED, OUTPUT); 

  queueMutex = xSemaphoreCreateMutex();
  xTaskCreate(MessageListenerTaskFunction, "Message listener", 8192, NULL, 1, NULL);
  xTaskCreate(InstructionExecutorTaskFunction, "Message listener", 8192, NULL, 1, NULL);
}

void loop() {}
