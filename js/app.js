import {DOMManager} from "./DOMManager.js";
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';

const domManager = new DOMManager();
const game = new Game();

domManager.createFrom();

document.querySelector('.game-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const pseudo = event.target.name.value;
  const diff = Number(event.target.difficulty.value);
  const theme = event.target.theme.value;
  const mode = event.target.mode.value;

  try {
    const data = await ApiService.createGame(pseudo,diff);
    console.log('Success:', data, data.id);
    game.startGame(data.id, theme, diff,mode);
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Erreur lors de la création de la partie');
  }
});
