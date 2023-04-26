const { Servient, Helpers, ThingDiscoveryImpl } = require("@node-wot/core");
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;

// create Servient and add MQTT binding
const servient = new Servient();
servient.addClientFactory(new MqttClientFactory(null));
const WoTHelpers = new Helpers(servient);

//const tdAddress = "http://192.168.128.1:8080/temp-controller";
const tddAddress = "http://192.168.78.101:8080";

//WoTHelpers.fetch(tdAddress).then(async (td) => {
//    console.log("Fetched:", tdAddress);

const td = {
    title: "temp-controller",
    description: "example from Youtube",
    events: {
        overheat: {
            description: "Temperature over 45°C",
            data: { type: "string" },
            forms: [
                { "href": "mqtt://192.168.78.101:3306/temp-controller/events/overheat" }
            ]
        }
    }
};

servient.start().then(async (WoT) => {
    const consumedThing = await WoT.consume(td);
    console.log("Got TD:", consumedThing.getThingDescription().title);

    consumedThing.subscribeEvent("overheat", async (message) => {
        // enlever ".value()" pour avoir les métadonnées :
        console.log("Overheat event:", await message.value());
    }, console.error);
});

// }).catch(e => console.error)

console.log("fini");