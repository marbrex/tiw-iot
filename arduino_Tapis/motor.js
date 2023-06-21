import five from 'johnny-five'

import mqtt from 'mqtt'

const client = mqtt.connect('mqtt://192.168.78.96:3306')

const topic = 'arduino3'

var board = new five.Board();

var motorSpeed = 0;
var goForward = true;
var isRunning = false;
var directionSwitch, onOffSwitch, motor, potPin;

board.on('ready', function() {
  directionSwitch = new five.Button(4);
  onOffSwitch = new five.Button(5);
  motor = new five.Motor([9, 3, 2]);
  potPin = new five.Sensor({
    pin: 'A0',
    freq: 250
  })
});

client.on('message', function (topicR, message) {

  const messageStr = message.toString()
  console.log(messageStr)

  if(messageStr != null){

    // allow command line access
    board.repl.inject({
      onOffSwitch: onOffSwitch,
      directionSwitch: directionSwitch,
      potPin: potPin,
      motor: motor
    });

    motor.start()
    console.log('Motor started')

    setTimeout(() => {
      motor.stop()
      console.log('Motor stopped')
    }, 5000);

    
    // Listen for onOffSwitch 'press' event
    // toggle `isRunning` and start/stop motor
    onOffSwitch.on('press', function() {
      isRunning = !isRunning;

      if (isRunning) {
        motorStart();
      } else {
        motorStop()
      }
    });

    // Listen for directionSwitch 'press' event
    // toggle `goForward`
    // set isRunning to true (as this will start the motor)
    // call motorForward() or motorReverse()
    directionSwitch.on('press', function() {
      goForward = !goForward;
      if (!isRunning) isRunning = true;

      if (goForward) {
        motorForward();
      } else {
        motorReverse();
      }
    });

    // Listen to 'data' event on the Potentiometer
    // If the motor isn't running - get out
    // As the motor is running, set `motorSpeed`
    // Send the new speed through to a running motor
    potPin.on('data', function() {
      if (!isRunning) return;
      motorSpeed = this.value / 4;

      if (goForward) {
        motorForward(motorSpeed);
        console.log('Motor speed:', motorSpeed);
      } else {
        motorReverse(motorSpeed);
        console.log('Motor speed:', motorSpeed);
      }
    });

    /**
     * motorStart
     * Start the motor
     */

    function motorStart() {
      motor.start(motorSpeed);
    }

    /**
     * motorForward
     * Set the direction of the motor
     * Use `speed` if passed in, or default `motorSpeed`
     * @param  {Number} speed
     */

    function motorForward(speed) {
      motorSpeed = speed || motorSpeed;
      motor.forward(motorSpeed);
    }

    /**
     * motorReverse
     * Set the direction of the motor
     * Use `speed` if passed in, or default `motorSpeed`
     * @param  {Number} speed
     */

    function motorReverse(speed) {
      motorSpeed = speed || motorSpeed;
      motor.reverse(motorSpeed);
    }

    /**
     * motorStop
     * Stop the motor
     */

    function motorStop() {
      motor.stop();
    }
  }
});

client.on('connect', function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log('Subscribed to:', topic)
    }
  })
})