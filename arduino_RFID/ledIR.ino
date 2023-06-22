#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

// If using the breakout with SPI, define the pins for SPI communication.
#define PN532_SCK  (2)
#define PN532_MOSI (3)
#define PN532_SS   (4)
#define PN532_MISO (5)

// If using the breakout or shield with I2C, define just the pins connected
// to the IRQ and reset lines.  Use the values below (2, 3) for the shield!
#define PN532_IRQ   (2)
#define PN532_RESET (3)  // Not connected by default on the NFC Shield

// Or use this line for a breakout or shield with an I2C connection:
Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

// Pin pour la LED infrarouge
int ledPin = 9;

// Pin pour le capteur infrarouge
int irSensorPin = A5;

// Or use hardware Serial:
//Adafruit_PN532 nfc(PN532_RESET, &Serial1);

void setup(void) {
  Serial.begin(115200);
  // Configuration de la LED infrarouge en sortie

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
  // while (!Serial) delay(10); // for Leonardo/Micro/Zero

//   nfc.begin();

//   uint32_t versiondata = nfc.getFirmwareVersion();
//   if (! versiondata) {
//     while (1); // halt
//   }
//   // Got ok data, print it out!
}


void loop(void) {

  // Lecture de la valeur du capteur infrarouge
  int irSensorValue = analogRead(irSensorPin);
  Serial.println(irSensorValue)

//   // if(irSensorValue > 1){
//     uint8_t success;
//     uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
//     uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)

//     // Wait for an ISO14443A type cards (Mifare, etc.).  When one is found
//     // 'uid' will be populated with the UID, and uidLength will indicate
//     // if the uid is 4 bytes (Mifare Classic) or 7 bytes (Mifare Ultralight)
//     success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

//     if (success) {
//       // Display some basic information about the card
//       nfc.PrintHex(uid, uidLength);
//       delay(3000);
//     }    
  // }
}