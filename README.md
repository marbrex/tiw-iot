# Projet IoTIW 2022-2023

Vous trouverez dans ce document le "pitch" du projet de cette année. Les instructions pour construire les différentes parties vous seront données au fur et à mesure des TPS.

## Description de l'application

On considère un système simplifié de livraison de bagages à l'arrivée des passagers dans un aéroport. Ce système s'appuie sur un ensemble de capteurs et d'actionneurs, lesquel sont pilotés par le système d'information (SI) de l'aéroport. Celui-ci est relié aux SI des différentes compagnies aériennes opérant les vols. Les communications entre les différents éléments du système se font en Machine-to-Machine (M2M), c'est-à-dire sans l'intervention d'un opérateur humain.

## Recueil des besoins

Le cahier des charges du SI de livraison des bagages stipule que :

- l'association des points de livraison à un vol, et le début et la fin de la livraison sont décidés par un utilisateur employé de l'aéroport
- chaque point de livraison indique sur un écran le numéro et la provenance du vol (dans ce TP, on ne mettra en place qu'un seul écran)
- les identifiants RFID des bagages transportés sont indiqués par les SI des compagnies au SI de l'aéroport, avec le numéro du vol sur lequel ils ont été embarqués
- les SI des compagnies sont informés des changements d'état de la livraison des bagages pour un vol (pas encore commencée, en cours, terminée) et d'éventuelles anomalies de livraison (voir ci-dessous)
- en cas : d'erreur d'identification, d'absence de correspondance entre l'identifiant d'un bagage et un vol, d'absence de point de livraison pour le vol d'un bagage (par exemple, un bagage en retard), une anomalie est levée et le bagage correspondant est dérouté vers service dédié ("litige bagages") ; si un vol est lié à ce bagage, le SI de l'aéroport informe celui de la compagnie correspondante
- une interface permet aux employés de l'aéroport de suivre en temps réel la distribution des bagages, le nombre de bagages restants pour chaque vol et les anomalies
- dans la mesure du possible, on essayera d'optimiser la vitesse de livraison et de diminuer le taux d'anomalies

## Montage physique

Chaque bagage est identifié par un tag RFID contenant un numéro spécifique au bagage. Les bagages circulent sur des tapis roulants. Au début de leur trajet ils passent sous un portique, qui _via_ un scanner RFID et un capteur infrarouge, détecte quel bagage est passé et à quel moment. À la fin du tapis, les bagages sont dirigés vers les points de livraison (on imagine qu'il s'agit d'autres tapis roulants) par un aiguillage mis en oeuvre par un moteur pas à pas. L'aiguillage est également précédé d’un capteur infrarouge qui lui indique quand un bagage arrive pour qu'il positionne l'aiguillage.

Le montage réel que vous aurez à réaliser comportera les mêmes capteurs et les mêmes actionneurs. Toutefois, nous ne vous fournirons ni tapis roulant, ni bagages. Il faudra fabriquer des objets en modèles réduits qui les représentent.

Vous utiliserez deux microcontrôleurs arduino UNO (un à chaque extrêmité du "tapis roulant") :
- le premier sera relié au capteur RFID et à un détecteur de passage (LED + capteur infrarouge) à l'entrée du tapis
- le second sera relié à un détecteur de passage à la sortie du tapis, à moteur pour réaliser l'aiguillage, et à un écran LCD

Ces deux microcontrôleurs seront branchés (en USB) à des machines _différentes_ et communiqueront par envoi de message (voir ci-dessous).

## Infrastructure réseau

L’ensemble des communications M2M entre les composants physiques et logiciels est centralisé dans un bus de messages faisant partie du SI de l'aéroport. Les différents composants étant distribués physiquement, c'est le protocole de communication MQTT qui est utilisé, et le bus est donc un _broker MQTT_ (en l'occurrence : [NanoMQ](https://nanomq.io/)). C'est l'observation de ce bus qui permet notamment le suivi en temps réel de la livraison des bagages.

Le SI de l'aéroport sera hébergé sur une VM de l'infra OpenStack. Nous vous fournissons une VM "Docker ready" sur laquelle vous n'avez qu'à récupérer l'image Docker de NanoMQ et démarrer un conteneur...
Mais : les ports standards pour MQTT sont 1883 pour l'échange de messages en TCP et 8083 en WebSocket. L'infra OpenStack se trouvant derrière un parefeu qui bloque ces ports, il faudra les rediriger ainsi : 1883 -> 3306 et 8083 -> 8080.

Au final, la commande à taper dans votre VM pour démarrer un conteneur NanoMQ simple et accessible de l'extérieur dans votre VM est :

`docker run -d -p 3306:1883 -p 8080:8083 --name nanomq  emqx/nanomq:0.17.0`

Nous vous fournissons un exemple simple de clients NodeJS capables de dialoguer avec le broker MQTT.

Remarques :

- _A priori_ pour les échanges de messages en MQTT, vous ne vous servirez que du port TCP. La redirection sur le port 8080 pourra vous resservir si vous activez l'[API HTTP](https://nanomq.io/docs/en/latest/http-api/v4.html) pour le contrôle / monitoring du broker.
- Pour affiner la configuration du broker, vous pouvez récupérer [le fichier de configuration par défaut sur le dépôt GitHub](https://github.com/emqx/nanomq/blob/master/etc/nanomq.conf) et le lier par un volume Docker.

### Références

- Protocole : [MQTT](https://mqtt.org/)
- Broker utilisé : [NanoMQ](https://nanomq.io/)
- Client utilisé (en JS) : [MQTT.js](https://github.com/mqttjs/MQTT.js)
