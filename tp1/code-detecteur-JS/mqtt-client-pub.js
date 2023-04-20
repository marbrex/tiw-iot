// Source : https://github.com/mqttjs/MQTT.js

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"
let client = mqtt.connect('mqtt://192.168.78.96:3306') // create a client

client.on('connect', function () {
  client.publish('test/mytopic', process.argv[2]);
  client.end();
})