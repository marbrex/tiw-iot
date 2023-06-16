import * as mqtt from "mqtt";
const client = mqtt.connect("mqtt://192.168.78.96:3306");
const topic = "iot/arduino";

client.on("connect", function () {
  client.publish(topic, "Hello mqtt");
  client.end();
});