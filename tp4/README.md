# TP4 - Systèmes Cyber-Physiques

Dans ce TP, vous allez modéliser et implémenter la "partie virtuelle" des objets connectés de votre projet. Vous leur donnerez des comportements de haut niveau et des capacités d'interaction.

## Objectifs

- Se rapprocher d'un projet comportant une part de modélisation physique complexe
- Implémenter une boucle de rétroaction

## Réalisation du tapis roulant

Votre projet sera désormais composé de 3 éléments : les 2 que vous avez déjà réalisés (capteur de bagages et aiguillage), plus le tapis roulant.

Ce tapis sera réalisé en Lego, et actionné par un moteur "DC" arduino. L'idée est d'utiliser un moteur continu et un "H-bridge" pour pouvoir en modifier la vitesse.

- Pour le montage arduino, vous vous réferrerez au projet 10 "Zoetrope" du starter kit ([description en ligne ici](https://programminginarduino.wordpress.com/2016/03/05/project-11/))
- Pour le code, vous trouverez [ici](https://github.com/chrisbuttery/johnny-five-arduino-starter-kit-examples/blob/master/zoetrope.js) le code JS qui fait fonctionner le même montage avec Johnny-Five.
- Pour la connexion entre le moteur et un axe Lego, nous vous fournissons la pièce miracle qui permettra l'interopérabilité entre ces 2 mondes
- Pour le tapis proprement dit, à vous de le réaliser en Lego et de vous assurer qu'il peut être correctement actionné par le moteur.

## Création des "agents" / jumeaux numériques

- Comme vous le feriez en Génie Logiciel avec les principes GRASP, déterminez les responsabilités de chacun des objets (normalement, vous aviez déjà commencé ce travail au TP 3).
- Faites en sorte que chacun s'acquitte du mieux possible de ses responsabilités. En d'autres termes :
  - intégrez à votre code des procédures de vérification de la qualité des données produites à l'aide des principes présentés en cours
  - mettez en place des boucles de rétroaction pour vérifier que votre système réagit correctement à vos actions
- Identifiez ensuite les interactions entre les agents et implémentez-les à l'aide du protocole de communication interne de la plateforme (MQTT).

## Aspects holistiques : boucle de rétroaction "globale"

Une fois les 3 composants fonctionnels et reliés, faites en sorte d'optimiser le fonctionnement du système global : accélérez au maximum la vitesse du tapis tout en vous assurant de la bonne livraison de chaque bagage et de l'absence de blocage du système. La question suivante peut vous aider pour la réalisation.

**Remarque** : le tapis est également censé s'arrêter quand il n'y a aucun bagage dessus.

## Flux de données

Afin de mettre en place une représentation réaliste de l'état du tapis, essayez d'adopter une approche fondée sur les flux de données avec par exemple un modèle de fenêtre glissante qui aura pour objectif de conserver un nombre constant de bagages sur le tapis. Ce modèle pourra être perfectionné en fonction de données plus précises, comme par exemple la prévision du temps que mettra l'aiguillage à changer de position entre deux bagages...
