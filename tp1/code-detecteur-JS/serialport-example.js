// Sources :
// - https://github.com/mqttjs/MQTT.js
// - https://serialport.io/docs/guide-usage

import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"

import { SerialPort } from 'serialport'

// Create MQTT client
const client = mqtt.connect('mqtt://192.168.78.96:3306') // create a client

// Create a port
const port = new SerialPort({
    path: 'COM8',
    baudRate: 115200
  },
  function (err) {
    if (err) {
      return console.log('Error: ', err.message)
    }
  }
)

// Use MQTT broker
client.on('connect', function () {
  client.publish('test/mytopic', process.argv[2]);
  client.end();
})

// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
  console.log('Data1:', port.read())
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
  console.log('Data2:', data)
})

// Pipe the data into another stream (like a parser or standard out)
const lineStream = port.pipe(new Readline())
