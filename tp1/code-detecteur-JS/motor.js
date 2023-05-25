import five from 'johnny-five'

const board = new five.Board()

console.log("yoloooo")

//board.on('ready', function() {

//console.log("yoloooo")
//  const motor = new five.Motor([9, 2, 3])

//   const onOffButton = new Button(4)
//   const inversionButton = new Button(5)
//   const potentiometer = new Sensor({
//     pin: 'A0',
//     freq: 250
//   })

//   let motorSpeed = 0
//   let goForward = true
//   let isRunning = false

//   // Gestion du bouton d'allumage/arrêt
//   onOffButton.on('press', function() {
//     if (isRunning) {
//       motor.stop()
//       isRunning = false
//       console.log('Moteur arrêté.')
//     } else {
//       motor.start(motorSpeed)
//       isRunning = true
//       console.log('Moteur démarré.')
//     }
//   });

//   // Gestion du bouton d'inversion de rotation
//   inversionButton.on('press', function() {
//     goForward = !goForward
//     if (goForward) {
//       motor.forward(motorSpeed)
//       console.log('Rotation : Avant')
//     } else {
//       motor.reverse(motorSpeed)
//       console.log('Rotation : Arrière')
//     }
//   });

//   // Gestion du potentiomètre pour régler la vitesse du moteur
//   potentiometer.on('data', function() {
//     motorSpeed = this.value >> 2; // Conversion de la valeur lue (0-1023) en une valeur de vitesse acceptable (0-255)
//     if (isRunning) {
//       motor.speed(motorSpeed)
//       console.log('Vitesse : ' + motorSpeed)
//     }
//   })
 //})
