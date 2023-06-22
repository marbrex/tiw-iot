import mqtt from 'mqtt'
import five from 'johnny-five'

const board = new five.Board()
const client = mqtt.connect('mqtt://192.168.78.96:3306')

const topic = 'arduino2'
const topic2 = "arduino4"

var lcd, servo, greenLight, redLight, ledPin, irSensor, compteur

board.on('ready', function () {
  // Déclaration de l'écran LCD
  lcd = new five.LCD({
    pins: [12, 11, 5, 4, 3, 2],
    rows: 2,
    cols: 16
  })

  // A verifier quels pins sont utilisées pour les leds
  greenLight = new five.Led(13)
  redLight = new five.Led(7)

  ledPin = new five.Led(10)
  irSensor = new five.Sensor("A5")

  //Déclaration du moteur pas à pas
  servo = new five.Servo({
    pin: 9,
    startAt: 0,
    range: [0, 180]
  })


  // Initialisation de la position du servo moteur
  servo.to(100)
  redLight.on()

  ledPin.on()

  compteur = 0

  // Événement de lecture du capteur infrarouge
  irSensor.on("change", function() {
    const sensorValue = this.value;
    console.log("Valeur du capteur :", sensorValue);

    // Si un objet est détecté et suffisamment de temps s'est écoulé depuis la dernière détection
    if (sensorValue > 200) {
      compteur++;
      if (compteur > 4) {
        console.log("Bagage détecté");
        compteur = 0;

        // Publier le message MQTT "stop"
        client.publish(topic2, "stop");
      }
    } else {
      compteur = 0;
      // Extinction de la LED infrarouge
      //mqttClient.publish(topic, "1");
    }
  });
})

client.on('message', function (topicR, message) {

  // Convertir le message en une chaîne de caractères
  const messageStr = message.toString()
  console.log(messageStr)

  // Parsing de la chaîne JSON en objet JavaScript
  const data = JSON.parse(messageStr);

  // Récupération des valeurs d'aéroport et de tapis

  let airport = ""
  let tapis = ""

  if(data[0] != undefined){
    airport = data[0].AirportName;
    tapis = data[0].Tapis;
  } else {  
    console.log("Erreur de parsing");
    airport = "erreur";
    tapis = "erreur";
  }
  

  console.log("Aéroport :", airport);
  console.log("Tapis :", tapis);

  // TODO : Réaliser la recherche de bagage via l'id récupérer pour
  // savoir où la bagage doit aller : RIGHT/LEFT/DISPUTE
  // En attendant, on va faire un aléatoire entre les 3 reponses


  var destination = ""

  // Détection d'un bagage
  if (messageStr != null) {

    redLight.off()
    greenLight.on()
    

    servo.to(0)
    // Oriente le servo moteur dans la bonne position
    if (tapis == 1) { // RIGHT
      destination = airport
      servo.to(200)
    } else if (tapis == 2) { // LEFT
      destination = airport
      servo.to(400)
    } else if (tapis =="erreur") { // DISPUTE
      destination = airport
      servo.to(600)
    }


    // Affiche la position du switch sur l'écran LCD
    lcd.clear().print(destination)

    setTimeout(() => {
      
      redLight.on()
      greenLight.off()
      servo.to(0)

    }, 2000);
  }
})

client.on('connect', function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log('Subscribed to:', topic)
    }
  })
})