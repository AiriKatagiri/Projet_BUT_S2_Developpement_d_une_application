import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';
import {DOMManager} from './DOMManager.js';
export class Game {
  /**
   * @type {number} id identifiant de la partie en cours
   */
  #id

  /**
   * @type {number} pairsRestante nombre de paires de carte restante
   */
  #pairsRestante;

  /**
   * @type {number || null} timerInterval le setInterval
   */
  #timerInterval = null;

  /**
   * @type {number} secondsElapsed le nombre de secondes écoulées depuis le début de la partie
   */
  #secondsElapsed = 0;

  /**
   * @type {HTMLAudioElement} victorySound l'audio si victoire
   */
  #victorySound = new Audio('./assets/sounds/victory.mp3');
  async endGame() {
    this.#stopTimer();
    try {
      const result = await ApiService.updateGameResult(this.#id, this.#pairsRestante);
      console.log('Fin de partie:', result);
      setTimeout(() => {
        const message = `Partie terminée ! Temps : ${this.#formatTime(this.#secondsElapsed)}`;
        if (this.#pairsRestante === 0) {
          this.#launchConfetti();
          this.#playVictorySound();
          alert("VICTOIRE !\n" + message);
        } else {
          alert("Partie abandonnée.\n" + message);
        }
        this.#resetToHome();
      }, 100);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Erreur lors de la fin de la partie');
      setTimeout(() => this.#resetToHome(), 100);
    }

  }

  #playVictorySound() {
    if (this.#victorySound) {
      this.#victorySound.currentTime = 0; // Remettre au début
      // Le .play() renvoie une promesse, on gère l'erreur silencieusement
      this.#victorySound.play().catch(error => {
        console.warn("Le son n'a pas pu être lu (vérifiez le fichier ou l'interaction utilisateur):", error);
      });
    }
  }

  #launchConfetti() {
    if (typeof confetti === 'function') {

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    }
  }

  #resetToHome() {
    const gameArea = document.querySelector('.game-area');
    if (gameArea) gameArea.classList.add('hidden');

    const setupForm = document.querySelector('.setup-form');
    if (setupForm) setupForm.classList.remove('hidden');

    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) gameBoard.innerHTML = '';

    this.#id = null;
    this.#pairsRestante = 0;
    this.#secondsElapsed = 0;

    this.#updateTimerDisplay();

    console.log("Retour à l'accueil effectué.");
  }

  /**
   * Start a new game.
   * @param {number} id - The game ID.
   * @param {string} theme - Le thème choisi (animals, fruits, cars).
   * @param {number} difficulty - Le nombre de paires.
   */
  startGame(id, theme, difficulty) {
    this.#id = id;
    this.#pairsRestante = difficulty;
    const setupForm = document.querySelector('.setup-form');
    if (setupForm)
      setupForm.classList.add('hidden');

    const gameArea = document.querySelector('.game-area')
    if (gameArea)
      gameArea.classList.remove('hidden');

    const header = document.querySelector('.game-area-header');
    if (header) {
      header.innerHTML = `
        <h2>Partie en cours</h2>
        <div class="game-timer" id="game-timer">00:00</div>
        <button id="abandon">Abandonner</button>
      `;

      document.getElementById('abandon').addEventListener('click', () => {
        this.endGame();
      });
    }
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
          alert("Bravo ! Partie terminée !");
          this.endGame();
        }, 500);
      }
    });
    domManager.createCards(gameCards);
    this.#startTimer();
  }

  #startTimer() {
    if (this.#timerInterval) clearInterval(this.#timerInterval);

    this.#timerInterval = setInterval(() => {
      this.#secondsElapsed++;
      this.#updateTimerDisplay();
    }, 1000);
  }

  #stopTimer() {
    if (this.#timerInterval) {
      clearInterval(this.#timerInterval);
      this.#timerInterval = null;
    }
  }

  #updateTimerDisplay() {
    const timerElement = document.getElementById('game-timer');
    if (timerElement) {
      timerElement.textContent = this.#formatTime(this.#secondsElapsed);
    }
  }

  #formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const fmtMin = minutes < 10 ? `0${minutes}` : minutes;
    const fmtSec = seconds < 10 ? `0${seconds}` : seconds;

    return `${fmtMin}:${fmtSec}`;
  }
}

