import { SerialPort } from "serialport";

const ledPin = 9; // Pin pour la LED infrarouge
const irSensorPin = "A5"; // Pin pour le capteur infrarouge

// Configuration de la communication série
SerialPort.list().then((ports) => {
  const port = new SerialPort({ path: "COM5", baudRate: 115200 });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Événement de réception de données depuis le port série
  port.on("data", async (data) => {
    const sensorValue = parseInt(data.toString(), 10);
    console.log(sensorValue);
    // Si un objet est détecté, la valeur du capteur infrarouge sera basse
    if (sensorValue > 500) {
      //console.log("Ya un truc");
    } else if (sensorValue == 0) {
      // Extinction de la LED infrarouge
      //console.log("RAS");
    }
  });

  // Gestion des erreurs de communication série
  port.on("error", (err) => {
    console.error("Erreur de communication série :", err);
  });
});
