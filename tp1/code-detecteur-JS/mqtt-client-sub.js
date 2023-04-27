import mqtt from 'mqtt'
import five from 'johnny-five'

const board = new five.Board()
const client = mqtt.connect('mqtt://192.168.78.96:3306')

const topic = 'iot/arduino'

var lcd, servo, greenLight, redLight, ir

board.on('ready', function () {
  // Déclaration de l'écran LCD
  lcd = new five.LCD({
    pins: [12, 11, 5, 4, 3, 2],
    rows: 2,
    cols: 16
  })

  // A verifier quels pins sont utilisées pour les leds
  greenLight = new five.Led(13)
  redLight = new five.Led(0)

  //Déclaration du moteur pas à pas
  servo = new five.Servo({
    pin: 9,
    startAt: 0,
    range: [0, 180]
  })

  // Déclaration du capteur infrarouge
  ir = new five.Proximity({
    controller: "HCSR04",
    pin: 1,
    freq: 200
  });

  // Initialisation de la position du servo moteur
  servo.to(100)

})

client.on('message', function (topicR, message) {

  // Convertir le message en une chaîne de caractères
  const messageStr = message.toString()
  console.log(messageStr)

  // TODO : Réaliser la recherche de bagage via l'id récupérer pour
  // savoir où la bagage doit aller : RIGHT/LEFT/DISPUTE
  // En attendant, on va faire un aléatoire entre les 3 reponses

  let orientation = Math.floor(Math.random() * 3)
  console.log(orientation)

  var destination = ""

  // Détection d'un bagage
  if (messageStr != null) {

    greenLight.on()
    redLight.off()

    servo.to(0)
    // Oriente le servo moteur dans la bonne position
    if (orientation == 0) { // RIGHT
      destination = "Lyon"
      servo.to(200)
    } else if (orientation == 1) { // LEFT
      destination = "Seoul"
      servo.to(400)
    } else if (orientation == 2) { // DISPUTE
      destination = "Rien"
      servo.to(600)
    }

    ir.on("data", function() {
      const distance = this.cm;
      console.log(distance);
    });

    // Affiche la position du switch sur l'écran LCD
    lcd.clear().print(destination)

    setTimeout(() => {
      
      greenLight.off()
      redLight.on()
      servo.to(0)

    }, 2000);
  }
    
    // Afficher le message sur l'écran LCD  
  //lcd.clear()
  //lcd.cursor(0, 0).print(message.toString()) // Affiche sur la première ligne de l'écran LCD
})

client.on('connect', function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log('Subscribed to:', topic)
    }
  })
})
