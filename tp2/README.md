# TP Web des Objets (WoT)

Dans ce TP, vous allez ajouter la couche WoT à votre TP IoT précédent. Fondamentalement, le but de votre application ne changera pas, mais cela vous permettra de rendre vos objets connectés découvrables et interopérables, et de coder plus facilement des applications complexes.

Techniquement, vous encapsulerez le code de vos objets (things) dans des _servients_, qui exposeront puis publieront des _Thing Descriptions (TD)_.

## Documentation

- Vous trouverez sur cette page des [liens vers l'ensemble des specs sur le WoT](https://www.w3.org/WoT/documentation/#further-reading).
- Une grande partie des bibliothèques que vous utiliserez dans ce TP seront fournis par le projet [Eclipse IoT ThingWeb](https://www.thingweb.io/), qui fournit une implémentation de référence pour les standards WoT, en grande partie réalisée par les membres du [W3C WoT WG](https://www.w3.org/WoT/wg/)
- Le dépôt GitHub du projet [node-wot](https://github.com/eclipse/thingweb.node-wot/) (issu de ThingWeb) vous permettra d'obtenir les sources et les exemples du code à utiliser pour créer des servients en JS.
- Si vous êtes patient.e, cette [vidéo Youtube](https://www.youtube.com/watch?v=wDX45dsD4GM) peut également vous aider.

## 1. Servient simple

Récupérez et faites tourner les exemples de code fournis : 

- un servient de [simulateur de capteur de température](./servient.js) qui génère une valeur aléatoire entre 0 et 50 degrés, et envoie une alerte si cette température dépasse 45°. Ce servient publie sa TD 
- un [consumer pour ce servient](consumer.js) qui récupère cette TD et l'utilise. Ce client se lance à l'aide de la commande wot-servient (voir [doc ThingWeb](https://github.com/eclipse/thingweb.node-wot#using-nodejs))

Sur le même modèle, intégrez le code du TP1 (détecteur de bagages) pour qu'il intègre un servient qui expose en HTTP le nombre de bagages détectés, et continue à envoyer (comme au TP1) les messages sur le broker avec les ID des bagages :

- écrivez la TD correspondante
- ajoutez au code existant les dépendances et l'utilisation du namespace WoT pour la production et l'exposition de cette TD

## 2. Thing Consumer

Reprenez maintenant le code du dispositif d'aiguillage. Ajoutez-y la couche WoT permettant la découverte de la TD du détecteur pour ne pas avoir à renseigner les informations sur le broker.

## 3. Servient complet

Vous allez maintenant transformer également le dispositif d'aiguillage en servient. Il réalisera donc les 2 fonctions d'un objet communicant : serveur et client.

- De la même façon que précédemment, écrivez et exposez la TD de cet objet
- Ajoutez la couche WoT
- produisez la TD
- dans le code de succès de la promesse, ajoutez la partie client en même temps que le code existant
- exposez la TD

Enfin, ajoutez une action qui consistera à "bloquer" l'aiguillage des bagages, c'est-à-dire à placer le moteur dans une position perpendiculaire au tapis.

## 4. Protocole IoT

Par défaut, les communications orientées-messages sont réalisées en HTTP + long polling.
&Agrave; l'aide de [cette doc](https://github.com/eclipse/thingweb.node-wot/blob/master/packages/binding-mqtt/README.md), modifiez le code pour que l'affichage des messages transite par votre broker MQTT.

**Remarque** : lors de l'instanciation d'un consumer, il récupère la TD "complète" exposée par le servient. Si vous requêtez cette TD et regardez le tableau `forms` de la propriété `events.votre_event`, vous verrez qu'il expose de nombreuses URLs ou récupérer les events. Pour utiliser celle explicitement passée dans la TD initiale, il faut passer un objet `InteractionOptions` en (3èmè) paramètre de la méthode `subscribe` du consumer, avec une propriété `formIndex` correspondant à l'ordre de l'URL que vous voulez utiliser.

## 5. Thing Description Directory

- Ajoutez à votre VM le container Docker de [TinyIoT Thing Directory](https://github.com/TinyIoT/thing-directory) (sur le port 8080 de votre VM).
- "déplacez" vos TDs sur cette TDD, et faites en sorte que l'aiguillage aille la chercher là (et trouve la bonne).

**Aide** : la fonction `WoT.discover()` retourne une erreur "Not Implemented"... Il est donc conseillé d'interroger la TDD avec un client générique OpenAPI comme [openapi-client-axios](https://www.npmjs.com/package/openapi-client-axios), à partir de la description de son API [ici](https://raw.githubusercontent.com/tinyiot/thing-directory/master/apidoc/openapi-spec.yml).
