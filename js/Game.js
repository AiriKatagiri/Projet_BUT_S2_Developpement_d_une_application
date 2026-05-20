import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';
import {DOMManager} from './DOMManager.js';
export class Game {
  /** @type {number || null} identifiant de la partie en cours. */
  #id

  /** @type {number}  nombre de paires de carte restante. */
  #pairsRestante;

  /** @type {number || null}  le setInterval. */
  #timerInterval = null;

  /** @type {number} le nombre de secondes écoulées depuis le début de la partie. */
  #secondsEcoulees = 0;

  /** @type {HTMLAudioElement} victorySound l'audio si victoire. */
  #victorySon = new Audio('./assets/sounds/victory.mp3');

  /** @type {String} le mode su jeu choisi. */
  #gameMode = 'basique';

  /** @type {number} le nombre de vies (pour le mode Vie Limitée). */
  #vie = 0;

  /** @type {number} le nombre max de vies (pour le mode Vie Limitée). */
  #maxVies = 0;

  /** @type {number} le temps en secondes maximales avant défaite (pour le mode Temps Limitée).*/
  #timeLimit = 0;

  /**
   * Gère la fin d'une partie
   * @returns {Promise<void>}
   */
  async endGame(raison) {
    this.#stopTimer();
    try {
      const result = await ApiService.updateGameResult(this.#id, this.#pairsRestante);
      console.log('Fin de partie:', result);
      setTimeout(() => {
        let message = `Temps : ${this.#formatTime(this.#secondsEcoulees)}`;
        if (this.#pairsRestante === 0) {
          alert("VICTOIRE !\n" + message);
          this.#confetti();
          this.#lanceVictorySon();
        } else if(raison === 'perteV') {
          alert('Plus de vies ! Partie perdue. ' + message);
        } else if(raison === 'perteT') {
          alert('Temps écoulé ! Partie perdue. ' + message);
        } else {
            alert("Partie abandonnée.\n" + message);
          }
        this.#resetHome();
      }, 100);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Erreur lors de la fin de la partie');
      setTimeout(() => this.#resetHome(), 100);
    }
  }

  /**
   * Lance le son après une victoire.
   */
  #lanceVictorySon() {
    if (this.#victorySon) {
      this.#victorySon.currentTime = 0;
      this.#victorySon.play().catch(error => {
        console.warn("Le son n'a pas pu être lu (vérifiez le fichier ou l'interaction utilisateur):", error);
      });
    }
  }

  /**
   * Lance les confettis après une victoire.
   */
  #confetti() {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
      }, 250);
    }
  }

  /**
   * Renvoie sur la page d'accueil avec le formulaire.
   */
  #resetHome() {
    const gameArea = document.querySelector('.game-area');
    if (gameArea) gameArea.classList.add('hidden');

    const setupForm = document.querySelector('.setup-form');
    if (setupForm) setupForm.classList.remove('hidden');

    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) gameBoard.innerHTML = '';

    this.#id = null;
    this.#pairsRestante = 0;
    this.#secondsEcoulees = 0;
    this.#actualisationTime();
    console.log("Retour à l'accueil effectué.");
  }

  /**
   * Start a new game.
   * @param {number} id - The game ID.
   * @param {string} theme - Le thème choisi (animals, fruits, cars).
   * @param {number} difficulty - Le nombre de paires.
   * @param {string} mode - Le mode de jeu choisi.
   */
  startGame(id, theme, difficulty,mode) {
    this.#id = id;
    this.#pairsRestante = difficulty;
    this.#gameMode = mode;

    if(mode === 'vie') this.#modeVie(difficulty);
    if (mode === 'time') this.#modeTime(difficulty);
    this.#setup();
    this.#setupHeader(mode);
    this.#afficheCartes(theme, difficulty);
    this.#startTimer();
  }

  /**
   * Affiche le plateau de jeu.
   */
  #setup(){
    const setupForm = document.querySelector('.setup-form');
    if (setupForm)
      setupForm.classList.add('hidden');

    const gameArea = document.querySelector('.game-area')
    if (gameArea)
      gameArea.classList.remove('hidden');
  }

  /**
   * Setup le header pour le plateau de jeu.
   * @param {String} mode le mode du jeu.
   */
  #setupHeader(mode) {
    const header = document.querySelector('.game-area-header');
    if (header) {
      const livesDisplay = (mode === 'vie') ? this.#affichageVie() : '';
      const maxTime = (mode === 'time') ? this.#affichageTemps() : '';
      header.innerHTML = `
        <h2>Partie en cours</h2>
        <div class="game-timer" id="game-timer">00:00</div>
        <div id="lives-container">${livesDisplay}</div>
        <div id="limitTime-container">${maxTime}</div>
        <button id="abandon">Abandonner</button>
      `;
      document.getElementById('abandon').addEventListener('click', () => {this.endGame('abandon').catch(console.error);});
    }
  }

  /**
   * Affiche les cartes
   * @param {String} theme le theme de la partie.
   * @param {number} difficulty la difficulté de la partie.
   */
  #afficheCartes(theme, difficulty){
    const allImages = imageCollections[theme];
    const selectedImages = allImages.slice(0, difficulty);
    const gameCards = [...selectedImages, ...selectedImages];
    gameCards.sort(() => Math.random() - 0.5);
    const domManager = new DOMManager();

    domManager.setOnMatch(() => {
      this.#pairsRestante--;
      console.log("Paires restantes :", this.#pairsRestante);
      if (this.#pairsRestante === 0) {
        setTimeout(() => {
          this.endGame('victoire').catch(console.error);
        }, 500);
      }
    });

    domManager.setOnMismatch(() => {
      if (this.#gameMode === 'vie') {
        this.#perteVie();
      }
    });
    domManager.createCards(gameCards);
  }

  /** @type {Object} nombre de vie selon la difficulté */
  #viesConfig = { 4: 3, 5: 4, 6: 5, 8: 7 };

  /**
   * Initialise le nombre de vie et le nombre max de vie.
   * @param {number} difficulty
   */
  #modeVie(difficulty){
    this.#vie = this.#viesConfig[difficulty];
    this.#maxVies = this.#vie;
  }

  /**
   * Créer le html pour afficher les coeurs.
   * @returns {string}
   */
  #affichageVie() {
    let html = '';
    for (let i = 0; i < this.#maxVies; i++) {
      html += (i < this.#vie) ? '❤️' : '';
    }
    return `<span style="font-size: 1.5rem; letter-spacing: 5px;">${html}</span>`;
  }

  /**
   * Créer le html pour afficher la limite de temps.
   * @returns {string}
   */
  #affichageTemps() {
    return  `<h2>Limite de temps : ${this.#timeLimit} secondes</h2>`;
  }

  /**
   * Permet d'actualiser le nombre de vies actuel.
   */
  #actualisationVie() {
    const container = document.getElementById('lives-container');
    if (container) {
      container.innerHTML = this.#affichageVie();
    }
  }

  /**
   * Gère la perte d'une vie.
   */
  #perteVie() {
    this.#vie--;
    this.#actualisationVie();

    const header = document.querySelector('.game-area-header');
    if (header) {
      header.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
      setTimeout(() => header.style.backgroundColor = 'transparent', 300);
    }

    if (this.#vie <= 0) {
      setTimeout(() => {
        this.endGame('perteV').catch(console.error);
      }, 600);
    }
  }

  /** @type {Object} nombre de secondes selon la difficulté */
  #timeConfig = { 4: 20, 5: 25, 6: 30, 8: 40 };

  /**
   * Initialise le temps limite selon la difficulté.
   * @param {number} difficulty
   */
  #modeTime(difficulty){
    this.#timeLimit = this.#timeConfig[difficulty]
  }

  /**
   * Commence le timer.
   */
  #startTimer() {
    if (this.#timerInterval) clearInterval(this.#timerInterval);

    this.#timerInterval = setInterval(() => {
      this.#secondsEcoulees++;
      this.#actualisationTime();
      if (this.#gameMode === 'time' && this.#timeLimit > 0) {
        if (this.#secondsEcoulees >= this.#timeLimit) {
          this.#stopTimer();
          this.endGame('perteT').catch(console.error);
        }
      }
    }, 1000);
  }

  /**
   * Arrête le timer
   */
  #stopTimer() {
    if (this.#timerInterval) {
      clearInterval(this.#timerInterval);
      this.#timerInterval = null;
    }
  }

  /**
   * Actualise le temps.
   */
  #actualisationTime() {
    const timerElement = document.getElementById('game-timer');
    if (timerElement) {
      timerElement.textContent = this.#formatTime(this.#secondsEcoulees);
    }
  }

  /**
   * Transforme des secondes en format minute seconde
   * @param {number} totalSeconds nombre de secondes.
   * @returns {string} Nombre de minutes + secondes correspondantes.
   */
  #formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const fmtMin = minutes < 10 ? `0${minutes}` : minutes;
    const fmtSec = seconds < 10 ? `0${seconds}` : seconds;

    return `${fmtMin}:${fmtSec}`;
  }
}

