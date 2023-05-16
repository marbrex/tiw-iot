# TP Plateforme IoT

Dans ce TP, vous allez mettre en place une "plateforme" IoT et WoT. Cette plateforme sera matérialisée par :

- une partie "edge", qui s'exécutera sur les PC reliés aux arduinos
- une partie "cloud", qui s'éxécutera sur votre VM

Vous aurez donc plusieurs instances de node-red sur plusieurs machines. Les différentes instances de la plateforme, ainsi que les composants déployés dessus communiqueront à l'aide de messages MQTT envoyés au broker installé sur votre VM.

Techniquement, vous allez packager une partie du code JS que vous avez écrit sous forme de "flots" de composants, pour qu'il puisse s'exécuter dans node-red. Vous déploierez ensuite ces flots sur les instances appropriées :

- les flots contenant les composants permettant la connexion et le contrôle des arduinos sur les PC en edge
- ceux permettant l'exécution de l'application de gestion de livraison des bagages sur le cloud

## Documentation

- Vous utiliserez la plateforme [node-red](https://nodered.org/), dédiée à l'IoT mais qui supporte aussi bien la communication "bas-niveau" que les couches WoT et SWoT. Node-red est une plateforme "orientée flots de données" et qui possède une interface graphique qui s'exécute dans un navigateur.
- Node-red possède sa propre [bibliothèque de composants](https://flows.nodered.org/) (qui sont eux-mêmes des projets NodeJS).
- Vous aurez besoin des librairies / plugins suivants pour node-red :
  - [node-red-contrib-wot-discovery](https://flows.nodered.org/node/node-red-contrib-wot-discovery) : WoT scripting API
  - [openapi-red](https://flows.nodered.org/node/openapi-red) : client OpenAPI
  - [node-red-contrib-mqtt-dynamicsub](https://flows.nodered.org/node/node-red-contrib-mqtt-dynamicsub) : plus de choix dans les noeuds MQTT

## 1. Plateforme cloud

### 1.1. Démarrage de node-red sur votre VM avec Docker

Ce n'est pas très joli, mais vous allez lancer node-red sur le port 80 de votre VM, donc en sudo, car c'est le seul port disponible restant ouvert dans le firewall OpenStack (avec le 443) :

`sudo docker run -it -p 80:1880 -v node_red_data:/data --name mynodered nodered/node-red`

Dans un premier temps, conservez le mode interactif, car cela vous permettra de faire des `console.log()` dans vos scripts et d'observer le résultat sur votre terminal SSH. &Agrave; terme, vous pourrez lancer node-red en mode daemon.

### 1.2. Premier flot de composants

Node-red dispose d'une palette de composants avec des comportements prédéfinis. Vous pouvez les configurer dans une certaine mesure, ou bien les programmer (en JS) assez simplement.

Commencez par créer un flot simple, puis complexifiez-le progressivement :

- Prenez une "brique" `inject` et une autre `debug`, placez-les sur votre flot (le premier composant apparaît en tant que `timestamp` puisque c'est sa valeur par défaut) et reliez-les.
- Déployez et cliquez sur le carré de gauche de `timestamp`, et regardez l'onglet "debug" de la sidebar. Vous devez voir apparaître le timestamp.
- Prenez un autre composant `inject` et placez-le également dans le flot, et reliez-le aussi à `debug 1`. Double-cliquez sur ce composant pour avoir accès aux champs du message circulant dans le flot. Modifiez le type et le contenu du payload pouren faire un "Hello World" classique. Déployez et testez.
- Rajoutez dans le flot, entre les 2 premiers composants, une _fonction_ qui va parser le timestamp et transformer le message en objet JSON séparant les différents champs (année, mois, ... , seconde).
- "Coupez" la partie du flot qui affiche la date pour y insérer un passage par le broker MQTT :
  - Utilisez la brique `mqtt out` pour publier le timestamp sur un topic particulier de votre serveur. Pour cela, configurez le serveur globalement, en cliquant sur le crayon à droite du champ _Server_, et entrez l'URL complète de votre broker MQTT (y compris l'IP de votre VM, car "localhost" ne fonctionne pas). Choisissez un nom de topic, _QoS_ = _2_, et _Retain_ = _false_. _Name_ est le nom de votre composant affiché sur l'éditeur node-red.
  - De la même manière, utilisez `mqtt in` pour vous y abonner. Normalement, le serveur devrait être pré-configuré, et vous n'avez qu'à entrer le même nom de topic.
  - Reliez le tout et testez.
- Utilisez un composant `join` pour faire en sorte d'attendre d'avoir à la fois un message textuel et un timestamp pour générer une sortie sur le debug (indication : pour cela, vous devrez utiliser le champ "Topic" du composant inject)...

&Agrave; la fin de cette section, vous devriez avoir un flow similaire à celui-ci (à importer dans node-red) :

```JSON
[{"id":"76388be27d0c4b6c","type":"tab","label":"Premier exemple","disabled":false,"info":""},{"id":"d7d9b39250e7aceb","type":"inject","z":"76388be27d0c4b6c","name":"","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":180,"y":80,"wires":[["e0ad14374c1c1d06"]]},{"id":"664281a3a6d4ba29","type":"debug","z":"76388be27d0c4b6c","name":"affichage","active":true,"tosidebar":true,"console":true,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":990,"y":240,"wires":[]},{"id":"e0ad14374c1c1d06","type":"function","z":"76388be27d0c4b6c","name":"toJSON()","func":"var date = new Date(msg.payload);\nmsg.payload = {\n    year: date.getFullYear(),\n    month: date.getMonth(),\n    day: date.getDay(),\n    hour: date.getHours(),\n    minute: date.getMinutes(),\n    second: date.getSeconds()\n};\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":380,"y":80,"wires":[["c9d3d9cbb1c89dbe"]]},{"id":"39c6d835543ad199","type":"inject","z":"76388be27d0c4b6c","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"texte","payload":"COUCOU","payloadType":"str","x":200,"y":280,"wires":[["51127dc22708264a"]]},{"id":"c9d3d9cbb1c89dbe","type":"mqtt out","z":"76388be27d0c4b6c","name":"Send","topic":"nodered/test-flow","qos":"2","retain":"false","respTopic":"","contentType":"","userProps":"","correl":"","expiry":"","broker":"4d90d2066008370d","x":570,"y":80,"wires":[]},{"id":"2fa330cfebf27853","type":"mqtt in","z":"76388be27d0c4b6c","name":"Receive","topic":"nodered/test-flow","qos":"2","datatype":"auto-detect","broker":"4d90d2066008370d","nl":false,"rap":true,"rh":0,"inputs":0,"x":560,"y":200,"wires":[["51127dc22708264a"]]},{"id":"51127dc22708264a","type":"join","z":"76388be27d0c4b6c","name":"","mode":"custom","build":"object","property":"payload","propertyType":"msg","key":"topic","joiner":"\\n","joinerType":"str","accumulate":true,"timeout":"","count":"2","reduceRight":false,"reduceExp":"","reduceInit":"","reduceInitType":"","reduceFixup":"","x":790,"y":240,"wires":[["664281a3a6d4ba29"]]},{"id":"f7705e481a59de83","type":"comment","z":"76388be27d0c4b6c","name":"Transmission du message par le broker MQTT","info":"","x":570,"y":140,"wires":[]},{"id":"4d90d2066008370d","type":"mqtt-broker","name":"","broker":"mqtt://192.168.78.XXX:3306","port":"3306","clientid":"","autoConnect":true,"usetls":false,"protocolVersion":"4","keepalive":"60","cleansession":true,"birthTopic":"","birthQos":"0","birthPayload":"","birthMsg":{},"closeTopic":"","closeQos":"0","closePayload":"","closeMsg":{},"willTopic":"","willQos":"0","willPayload":"","willMsg":{},"userProps":"","sessionExpiry":""}]
```

**Note** : Pour faire fonctionner le code ci-dessus, il faut remplacer les `XXX` dans l'adresse du broker MQTT par le dernier octet de l'IP de votre VM **avant** de le copier dans node-red.

### 1.3. Utilisation de la bibliothèque de composants node-red

Maintenant que nous avons fini de jouer, passons aux choses sérieuses. Dans le menu "hamburger" en haut à droite, cliquez sur "Manage Palette" puis installez la librairie `node-red-contrib-wot-discovery`. Vous devez voir 3 nouveaux noeuds apparaître en bas de la palette.

#### 1.3.1. Client capteur

- &Agrave; l'aide des noeuds `inject` et `wot - fetch`, récupérez la TD de votre servient qui contient le capteur RFID.
- &Agrave; l'aide d'un noeud `wot - scripting`, récupérez la propriété luminosité, et tranmettez-la à un autre noeud (`debug`), pour qu'il la logue.
- Créez maintenant un endpoint HTTP avec `http in`, et faites en sorte d'exposer la valeur de cette luminosité. Vous pouvez vous aider de [cette doc](http://stevesnoderedguide.com/http-in-http-response-nodes).
- Récupérez la dernière valeur lue sur le lecteur de badges sur une URL du serveur Node-RED (par exemple `/lastid`). Pour cela, vous devez vous abonner aux messages MQTT, avec un autre noeud `wot - scripting`. Vous devez voir les messages s'afficher dans la console.

#### 1.3.2. Client actionneur

De la même manière, récupérez la TD de votre deuxième arduino, et mettez en place un nouveau mécanisme qui place le moteur dans l'une des positions correspondant aux différents tapis. Dans un premier temps, ce mécanisme sera déclenché manuellement, à l'aide d'un noeud `inject`.

#### 1.3.3. Logique métier

Vous allez maintenant déporter la partie "métier" de votre application dans le cloud :

- Programmez rapidement une API qui :
  - renvoie un numéro de vol (ou une erreur) quand elle est requêtée avec un numéro de badge
  - renvoie un numéro de tapis (ou une erreur) quand elle est requêtée avec un numéro de vol
- Générez-en le fichier OpenAPI

Dans votre instance de Node-Red "cloud" :
- Installez la bibliothèque `openapi-red`.
- Configurez un noeud `openapi - red` pour qu'il récupère cette API et l'interroge avec la dernière valeur de badge lue pour savoir sur quel vol était le propriétaire de la valise.
- Refaites la même opération avec un autre noeud qui enverra une requête pour récupérer le numéro de tapis.
- Envoyez ce numéro de tapis dans un message MQTT, sur un nouveau topic.
- Reprenez le client de l'actionneur, et faites en sorte qu'il se déclenche à la réception de ces messages.

## 2. Plateformes "edge"

L'objectif de cette partie est que vous conserviez le fonctionnement initial de votre code des deux côtés de l'application, tout en déployant ce code dans une instance locale de Node-RED, sur chacune des machines reliées à un arduino.

**Remarque** : un arduino sera commandé par le serveur de chaque instance (à l'aide de la librairie [node-red-node-serialport](https://flows.nodered.org/node/node-red-node-serialport)). C'est donc la machine hébergeant le serveur qui doit être physiquement reliée à l'arduino. Le serveur ne peut donc pas tourner dans un container Docker, il faut suivre la [procédure d'installation locale](https://nodered.org/docs/getting-started/development).

Une fois installé Node-RED localement avec sa bibliothèque node-red-node-serialport, vous allez "récupérer" votre code applicatif dans Node-Red. Pour cela, le plus simple est de créer une "grosse" fonction dans laquelle vous pourrez coller tout le code, puis de la réduire en petit morceaux et utiliser les noeuds à votre disposition, au fur et à mesure.

**Aide** : pour importer (avec `require`) un autre fichier JS dans une fonction, il faut utiliser [cette procédure](https://flows.nodered.org/flow/195773d3b493d81c9bf012f64da02ea3)


> &Agrave; la fin de ce TP, vous avez une plateforme IoT/WoT distribuée, qui possède son mécanisme de communication (MQTT) interne, puisque le broker n'est plus accédé par d'autres éléments de l'infrastructure. La répartition des rôles entre les différentes instances de Node-RED a été logiquement attribuée : les plateformes edge gèrent les fonctionnements des objets locaux, et la logique applicative est traitée dans le cloud.
