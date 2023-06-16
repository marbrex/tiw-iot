import { SerialPort } from "serialport";
import * as mqtt from "mqtt";

SerialPort.list().then((ports) => {

  const serialport = new SerialPort({  path: '/dev/ttyACM0', baudRate: 115200 });
  serialport.on("data", (data) => {

    // MQTT
    const client = mqtt.connect("mqtt://192.168.78.96:3306");
    const topic = "iot/arduino";

    client.on("connect", function () {
      client.publish(topic, data);
      client.end();
    });
  });

  serialport.on("error", (err) => {
    console.error("Error: ", err.message);
  });

  // Read data that is available but keep the stream in "paused mode"
  serialport.on('readable', function () {
    console.log('Data1:', serialport.read())
  })

  // Switches the port into "flowing mode"
  serialport.on('data', function (data) {
    console.log('Data2:', data.toString())
  })
});