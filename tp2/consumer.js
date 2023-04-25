// client.js
// Required steps to create a servient for a client
const { Servient, Helpers } = require("@node-wot/core");
const { HttpClientFactory } = require('@node-wot/binding-http');

const servient = new Servient();
servient.addClientFactory(new HttpClientFactory(null));
const WoTHelpers = new Helpers(servient);

const tdAddress = "http://localhost:8080/temp-controller";

WoTHelpers.fetch(tdAddress).then((td) => {
    console.log("Fetched:", tdAddress);
    try {
        servient.start().then(async (WoT) => {
            // Then from here on you can consume the thing
            // i.e let thing = await WoT.consume(td) ...
            try {
                let consumedThing = await WoT.consume(td);
                console.log("Got TD:", consumedThing.getThingDescription().title);

                consumedThing.subscribeEvent("overheat", async (message) => {
                    // enlever ".value()" pour avoir les métadonnées :
                    console.log("Overheat event:", await message.value());
                });
            } catch(error) {
                console.log("Consumer error:", error);
            }
        });
    }
    catch (err) {
        console.error("Servient error:", err);
    }
}).catch((err) => { console.error("Fetch error:", err); });