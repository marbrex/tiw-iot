import mqtt from 'mqtt'
import five from 'johnny-five'

const board = new five.Board()
const client = mqtt.connect('mqtt://192.168.78.96:3306')

const topic = 'iot/arduino'

var lcd

board.on('ready', function () {
  lcd = new five.LCD({
    pins: [12, 11, 5, 4, 3, 2],
    rows: 2,
    cols: 16
  })
})

client.on('message', function (topicR, message) {
 // console.log(topicR + ': ', message.toString())
  const json = message.toJSON()
  console.log(json)
  lcd.clear()
  lcd.cursor(0, 0).print(message.toString()) // Affiche le message sur la première ligne de l'écran LCD
})

client.on('connect', function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log('Subscribed to:', topic)
    }
  })
})
