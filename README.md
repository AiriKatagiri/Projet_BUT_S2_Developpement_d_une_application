# Projet_BUT_S2_Developpement_d_une_application
Ce projet consiste en la conception et le développement d'une variante numérique du jeu de société Memory, jouable en solitaire avec des mécaniques de jeu enrichies.

## Principe du Jeu
Basé sur le jeu traditionnel, notre application propose un défi solitaire contre la montre.
  * **Objectif :** Identifier toutes les paires de cartes identiques le plus rapidement possible.
  * **Déroulement :** Les cartes sont mélangées et disposées face cachée. Le joueur retourne deux cartes, si elles sont identiques, elles restent visibles. Sinon, elles se retournent automatiquement après 1 seconde.
  * **Communication Serveur :** L'application communique avec l'API memory.iuthub.fr pour enregistrer le début et la fin de chaque partie (pseudo, difficulté, score).

## Fonctionnalités Implémentées
### Socle Fonctionnel
  * **Formulaire d'accueil :** Saisie du pseudo, sélection de la difficulté (4, 5, 6, 8 paires), choix de la collection d'images et sélection du mode de jeu (basique, vies limitées, temps limité et mélange à chaque paire).
  * **Plateau de jeu dynamique :** Affichage des cartes, chronomètre en temps réel et gestion des appariements.
  * **Gestion API :** Envoi des données de création de partie (name, difficulty) et de fin de partie (nombreCoupsRestant) selon le protocole imposé.
  * **Bouton d'abandon :** Permet de terminer la partie prématurément et d'envoyer le score actuel au serveur.

### Fonctionnalités Avancées
Pour enrichir l'expérience utilisateur et répondre aux critères d'évaluation supplémentaires, les fonctionnalités suivantes ont été développées :
#### **Dynamisme de Victoire**
* **Effets visuels :** Une pluie de confettis s'affiche à l'écran lors de la victoire.
* **Effets sonores :** Un son de victoire est déclenché automatiquement pour célébrer la réussite du joueur.

#### **Trois Modes de Jeu Distincts**
Le comportement du jeu s'adapte automatiquement selon le niveau de difficulté choisi, avec des conditions de défaite spécifiques :
* **Vie limitée :** chaque paire de carte retournée qui ne sont pas les mêmes font perdre une vie quand le nombre de vies tombe à zéros la partie est perdu. Chaque niveau de difficulté à son nomber de vie attribué (4: 3, 5: 4, 6: 5, 8: 7).
* **Temps limité :** le joueur / la joueuse doit gagner avant le temps imparti sinon iel a perdu. Chaque niveau de difficulté à son temps limité attribué (4: 15, 5: 20, 6: 25, 8: 40).
* **Mélange à chaque paire :** dès qu'une paire est trouvé les cartes non trouvées ce mélange.

#### **Système d'Indice**
Un bouton "Indice" permet de révéler toutes les cartes pendant 1 seconde.
  Contrainte : Ce bouton est unique et ne peut être utilisé qu'une seule fois par partie.
  
#### **Bloc de Règles Intégré**
Une section dédiée affiche clairement les règles du jeu, les spécificités des modes de difficulté et le fonctionnement du bouton indice, assurant une prise en main rapide pour l'utilisateur.

## Structure du Projet

    /
    ├── index.html              # Point d'entrée : structure HTML et conteneurs principaux
    ├── README.md               # Documentation du projet
    ├── 2025-S2.01-Sujet.md     # Énoncé original du sujet
    │
    ├── assets/                 # Ressources statiques
    │   ├── images/             # Illustrations des cartes
    │   │   ├── animals/        # Collection : Animaux
    │   │   ├── cars/           # Collection : Voitures
    │   │   ├── fruits/         # Collection : Fruits
    │   │   ├── mask1.jpg       # Dos des cartes (variante 1)
    │   │   └── mask2.jpg       # Dos des cartes (variante 2)
    │   └── sounds/             # Effets sonores
    │       └── victory.mp3     # Son déclenché lors de la victoire
    │
    ├── css/
    │   └── style.css           # Feuille de style : mise en page, animations et confettis
    │
    └── js/                     # Logique JavaScript modulaire
        ├── app.js              # Point d'entrée : initialisation et liaison des modules
        ├── config.js           # Configuration globale (difficultés, temps, vies)
        ├── types.js            # Définition des types ou constantes partagées
        │
        ├── ApiService.js       # Gestion des requêtes HTTP vers l'API (POST game/score)
        ├── DOMManager.js       # Manipulation du DOM : affichage, événements clic, UI
        ├── Game.js             # Cœur du jeu : règles, validation des paires, modes de jeu
        └── ImageCollection.js  # Gestion dynamique des collections d'images (animals, cars, fruits)

## Autrice
Audrey
<br>Formation : BUT Informatique - Semestre 2
