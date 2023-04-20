import mqtt from 'mqtt'
import five from 'johnny-five'

const board = new five.Board()
const client = mqtt.connect('mqtt://192.168.78.96:3306')

const topic = 'iot/arduino'

board.on('ready', function () {
  const rfid = new five.RFID({
    controller: 'PN532_I2C',
    // Attention ici il faut bien vérifier que l'adresse du PN532 est la bonne
    // Elle peut changer en fonction du module utilisé
    address: 0x48
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
