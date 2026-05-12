import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';
import {DOMManager} from './DOMManager.js';
export class Game {
  /**
   * @type {number} id identifiant de la partie en cours
   */
  #id

  /**
   * @type {number} pairsRestante nombre de pair de carte restante
   */
  #pairsRestante;

  async endGame() {
    // Todo À compléter


    const idARemplacer = 1234;
    const nombreDePairesRestanteARemplacer = 5678;

    try {
      const result = await ApiService.updateGameResult(idARemplacer, nombreDePairesRestanteARemplacer);
      console.log('Fin de partie:', result);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Erreur lors de la fin de la partie');
    }

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
        <div class="game-timer">00:00</div>
        <button id="abandon">Abandonner</button>
      `;

      document.getElementById('abandon').addEventListener('click', () => {
        this.endGame();
      });
    }
  }
}

