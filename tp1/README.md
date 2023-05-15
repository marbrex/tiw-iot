# TP Objets connectés

Dans ce TP, vous allez mettre en place une grande partie du montage qui vous servira durant le projet. Cela consiste à construire les objets connectés que vous allez utiliser (microcontrôleurs, capteurs et actionneurs), et à développer le code qui servira à les piloter.

Comme indiqué dans le [pitch du projet](../README.md), il y a deux objets distincts, tous deux reliés à des PC par des câbles USB. Les deux objets seront contrôlés en JS côté PC, mais avec des technos différentes.

## 1. Détecteur de bagages

&Agrave; l'entrée du tapis roulant se trouve un détecteur de bagages qui permet de les identifier et de déclencher l'envoi d'un message avec l'heure à laquelle les bagages sont passés sous le portique.

### 1.1. Matériels

- Microcontrôleur arduino UNO
- Breadboard
- Capteur RFID/NFC [Adafruit PN532](https://www.adafruit.com/product/789)
- LED infrarouge [Vishay VSLB3940](https://fr.rs-online.com/web/p/leds-infrarouges/1452586)
- Récepteur infrarouge [Vishay TSSP4038](https://fr.rs-online.com/web/p/recepteurs-ir/9195848)

### 1.2. Montage

Le capteur RFID est un "shield" arduino, et se monte de façon très "straightforward". Il faut juste regarder la doc pour savoir quels sont les ports qui sont utilisés et se servir des autres pour le détecteur de passage IR.

Le détecteur de passage est constitué de la LED et du capteur infrarouges (IR). Vous les positionnerez sur le breadboard et les relierez à des ports libres de l'arduino.

Remarques :

- Les PN532 sont livrés sans les prises femelles qui permettent d'en faire de vrais "shields" sur lesquels on peut brancher de nouveaux composants. Il faudra donc arriver à bancher la LED et le capteur IR sur les trous qui permettent de déporter les connexions un peu plus l'intérieur du circuit imprimé (voir photo)
  ![vue des picots sur le shield arduino](shield-picots.png)
- Pour des raisons administratives, la dernière commande de LEDs + capteurs n'est pas encore arrivée. Certains groupes commenceront donc le TP avec des LEDs blanches et des capteurs de luminosité...

**Rappel : n'oubliez pas de débrancher le câble USB avant toute modification du montage !**

### 1.3. Code arduino

#### Premier contact avec l'arduino UNO

Si vous n'avez jamais programmé sur arduino avant, la première chose à faire quand vous avez installé l'[IDE arduino](https://www.arduino.cc/en/software) est de faire clignoter la "LED builtin". Un programme (sketch) vous est fourni pour cela dans le menu File -> Examples -> 01.Basics -> Blink. Assurez-vous que l'arduino est branché et reconnu par votre PC, et téléversez le code sur l'arduino.

#### Téléchargement et utilisation de la bibliothèque du capteur RFID

L'IDE comporte un _Library manager_ auquel vous pouvez accéder soit en cliquant sur les livres à gauche, soit par le menu Sketch -> Include Library. Installez la bibliothèque _Adafruit PN532_, avec sa dépendance (_Adafruit BusIO_).

**Quelques infos sur le codage RFID :** le capteur fonctionne pour les antennes RFID "simples" (passives), mais aussi en NFC. Vous pouvez donc le tester avec votre badge de l'université, votre téléphone... Le codage des ID détectés peut être en 4, 7 ou 10 bits, selon la norme de [MIFARE](https://fr.wikipedia.org/wiki/Mifare), qui permet d'accéder à un numéro de série (en clair) et à un identifiant (chiffré). Il faut une clé pour déchiffrer cet identifiant. Les cartes qui vous sont fournies ont une clé par défaut indiquée dans le sketch.

Une fois cette bibliothèque installée, vous avez accès, dans les exemples de code, à un sketch _readMiFare_ qui vous permet de lire l'ID d'une carte et de l'envoyer sur le port série (USB). Grâce au moniteur série (menu Tools -> Serial Monitor), vous pouvez observer ce qui passe par le câble USB. Téléverez cet exemple, et vérifiez-en le fonctionnement.

### 1.4. Code JS

Dans cette partie, vous allez réaliser un programme qui reçoit des données sur le port USB et les "pousse" vers une file de messages en utilisant le protocole MQTT. Accessoirement, nous vous fournissons aussi un code qui permet de vérifier que les messages sont bien arrivés sur le broker.

Commencez par initialiser un projet NodeJS.

Dans ce projet, ajoutez deux bibliothèques :
- [SerialPort](https://www.npmjs.com/package/serialport) qui vous permettra de "parler" à l'arduino
- [MQTT](https://www.npmjs.com/package/mqtt) qui vous permettra d'échanger des messages avec le broker MQTT installé sur votre VM.

Inspirez-vous du code fourni pour réaliser chaque partie (réception USB, émission de message, souscription/vérification).

## 2. Aiguillage des livraisons

Dans cette partie, il s'agit de mettre en place le dispositif à la sortie du tapis roulant. Ce dispositif permettra d'aiguiller les bagages vers différents (2 pour notre TP) points de livraison ou vers le litige bagage. Deux LEDs indiquent si l'aiguillage est "prêt" à recevoir un bagage et un détecteur de passage (comme précédemment) permet de vérifier qu'il est bien passé.

### 2.1. Matériels

Les matériels de cette partie sont issus de l'arduino starter kit (sauf LED et capteur IR, cf. partie précédente).

- Microcontrôleur arduino UNO
- Breadboard
- LEDs rouge et verte
- LED & capteur IR
- Moteur pas-à-pas
- &Eacute;cran LCD 

### 2.2. Montage

&Agrave; part pour la LED et le capteur LCD qui doivent être l'un face à l'autre, vous êtes libres de positionner les capteurs et les actionneurs comme vous le préférez sur le breadboard.

### 2.3 Code arduino

Vous utiliserez le protole [Firmata](https://github.com/firmata/protocol) pour communiquer avec l'arduino et pour le piloter depuis votre PC. Pour cela, vous n'avez qu'à téléverser le code _StandardFirmata_ sur l'arduino.

### 2.4. Code JS

De la même façon, vous utiliserez la bibliothèque standard [Johnny-Five](http://johnny-five.io/) qui est un client Firmata, et vous permet de contrôler les différents port d'E/S de l'arduino. Vous trouverez toutes les docs d'utilisation des capteurs et des actionneurs sur le site de cette bibliothèque.

Faites en sorte que :
- le moteur s'oriente dans l'une des trois directions
- lorsqu'un bagage est détecté, la led verte s'allume et la rouge s'éteigne
- la position de l'aiguillage s'affiche sur l'écran

## 3. Lien entre les 2 objets

Vous allez maintenant faire le lien entre les 2 dispositifs :

- Abonnez le second dispositif aux messages postés par le premier
- Quand un message est reçu, la LED rouge s'allume et la verte s'éteint
- Utilisez l'un des deux fichiers de données contenant la liste des vols à l'arrivée à Lyon (source : https://data.grandlyon.com/)
- Associez les 2 positions nominales du moteur à des `airportresources_baggagedelivery_baggagebelts`
- Associez (aléatoirement) un numéro de bagage à l'un des vols (majoritairement sur des points de livraison existants) pour permettre l'aiguillage
- Modifiez l'affichage de l'écran pour indiquer la provenance du vol plutôt que l'ID du bagage à chaque livraison
