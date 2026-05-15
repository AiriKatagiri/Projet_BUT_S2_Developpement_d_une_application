import {DOMManager, createFrom} from "./DOMManager.js";
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';

const domManager = new DOMManager();
const game = new Game();

createFrom();

document.querySelector('.game-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const pseudo = event.target.name.value;
  const diff = Number(event.target.difficulty.value);
  const theme = event.target.theme.value;

  try {
    // Todo Spécifier les paramètres de createGame()
    const data = await ApiService.createGame(pseudo,diff);
    console.log('Success:', data, data.id);
    game.startGame(data.id, theme, diff);
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Erreur lors de la création de la partie');
  }
});
