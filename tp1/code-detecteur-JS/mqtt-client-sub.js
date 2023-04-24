import mqtt from 'mqtt'
import five from 'johnny-five'

var five = require("johnny-five");
var board = new five.Board();


const client = mqtt.connect('mqtt://192.168.78.96:3306')

const topic = 'iot/arduino'

board.on("ready", function() {
  var led = new five.Led(13);
  led.blink(500);

  const rfid = new five.RFID({
    //test
  })

  rfid.on('tag', function (id) {
    console.log('ID:', id)
    client.publish(topic, id)
  })

 rfid.on('error', function (err) {
    console.error('Error:', err)
  })
})

client.on('connect', function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log('Subscribed to:', topic)
    }
  })
})

client.on('message', function (topicR, message) {
  console.log(topicR + ': ', message.toString())
})
