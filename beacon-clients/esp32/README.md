# ESP32 Andon Beacon Client

This is a simple and quick implementation of an example client for running an Andon beacon using an ESP32.

It operates using two separate tasks:

- Alert Listener: Listens for incoming MQTT messages and handles queuing/dequeuing.

- Instruction Runner: Continuously checks the queue and executes the instructions contained in each alert message.

> [!IMPORTANT]  
> I'm no expert in ESP32 development — this is just a basic example with limited features and far from perfect structure.  
> You should implement this in your own way based on your needs.
