// server.js
// Required steps to create a servient for creating a thing
const Servient = require('@node-wot/core').Servient;
const HttpServer = require('@node-wot/binding-http').HttpServer;
const MqttBrokerServer = require("@node-wot/binding-mqtt").MqttBrokerServer;

const servient = new Servient();
servient.addServer(new HttpServer());
servient.addServer(new MqttBrokerServer({ uri: "mqtt://192.168.78.101:3306" }));

// Données réutilisées dans la TD et dans l'implémentation des fonctionnalités
let currentTemp = 0;
const newTemp = () => { return Math.random() * Math.floor(50); };

servient.start().then((WoT) => {
    // Then from here on you can use the WoT object to produce the thing
    // i.e WoT.produce({.....})
    WoT.produce({
        title: "temp-controller",
        description: "example from Youtube",
        properties: {
            temperature: {
                type: "number",
                description: "temperature of the room",
                observable: true,
                readOnly: true,
                unit: "Celsius",
                forms: [{ "href": "http://localhost:8080/temperature" }]
            }
        },
        events: {
            overheat: {
                description: "Temperature over 45°C",
                data: { type: "string" },
                forms: [{ "href": "mqtt://192.168.78.101:3306/temp-controller/events/overheat" }]
            }
        }
    }).then(exposedThing => {
        console.log("Produced: ", exposedThing.getThingDescription().description);

        // define property handler
        exposedThing.setPropertyReadHandler("temperature", () => {
            return new Promise((resolve, reject) => { resolve(currentTemp); })
        });

        // expose the thing
        exposedThing.expose().then(() => {
            console.info("Exposed: ", exposedThing.getThingDescription().title);

            // update temp and fire event if needed
            setInterval(() => {
                currentTemp = newTemp();
                if (currentTemp > 25) { // 25 for the sake of demo time
                    console.log(currentTemp);
                    exposedThing.emitEvent("overheat", Math.trunc(currentTemp) + "°, Yféchô !");
                }
            }, 1000);
        });
    }).catch((e) => {
        console.log(e);
    })
});