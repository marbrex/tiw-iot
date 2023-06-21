import { SerialPort } from "serialport";
import * as mqtt from "mqtt";

SerialPort.list().then((ports) => {

  const serialport = new SerialPort({  path: '/dev/ttyACM0', baudRate: 115200 });
  serialport.on("data", (data) => {

    // MQTT
    const client = mqtt.connect("mqtt://192.168.78.96:3306");
    const topic = "arduino1";

    const decimalId = parseInt(data.toString(), 16)

    client.on("connect", function () {
      client.publish(topic, decimalId.toString());
      client.end();
    });
  });

  serialport.on("error", (err) => {
    console.error("Error: ", err.message);
  });

  // Switches the port into "flowing mode"
  serialport.on('data', function (data) {
    console.log('ID:', data.toString())
  })
});