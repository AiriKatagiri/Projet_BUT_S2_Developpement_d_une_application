export class DOMManager {
  /** @type {HTMLDivElement} firstCard est la première carte choisie*/
  #firstCard = null;

  /** @type {HTMLDivElement} secondCard est la seconde carte choisie*/
  #secondCard = null;

  /** @type {boolean} lockBoard est vrai si on ne peut pas retourner les cartes*/
  #lockBoard = false;

  /** @type {function} onMatchCallback est la fonction à appeler quand une paire est trouvée*/
  #onMatchCallback = null;

  /** @type {function} onMismatchCallback est la fonction à appeler quand une paire n'est pas correspondante*/
  #onMismatchCallback = null;

  /**
   * Définit la fonction à appeler quand une paire est trouvée
   * @param {Function} callback
   */
  setOnMatch(callback) {
    this.#onMatchCallback = callback;
  }

  /**
   * Définit la fonction à appeler quand une paire n'est pas correspondante
   * @param {Function} callback
   */
  setOnMismatch(callback) {
    this.#onMismatchCallback = callback;
  }

  /**
   * Ajoute toutes les images d'une collection sur le gameBoard
   * @param {Image[]} images le tableau d'images
   */
  createCards(images) {
    const gameBoard = document.querySelector('.game-board');
    if (!gameBoard) return;

    gameBoard.innerHTML = '';
    const totalCards = images.length;
    const columns = totalCards === 10 ? 5 : 4;
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    images.forEach(image => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.id = image.id.toString();

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="./assets/images/mask1.jpg" alt="Carte cachée">
          </div>
          <div class="card-back">
            <img src="${image.url}" alt="${image.name}">
          </div>
        </div>
      `;
      card.addEventListener('click', () => this.#cardClick(card));
      gameBoard.appendChild(card);
    });
  }

  /**
   * Gère les actions quand une carte est cliqué
   * @param {HTMLDivElement} card la carte cliqué
   */
  #cardClick(card) {
    if (this.#lockBoard) return;
    if (card === this.#firstCard) return;
    if (card.classList.contains('flip')) return;
    card.classList.add('flip');

    if (!this.#firstCard) {
      this.#firstCard = card;
      return;
    }
    this.#secondCard = card;
    this.#checkForMatch();
  }

  /**
   * Vérifie que deux cartes sont les mêmes.
   */
  #checkForMatch() {
    const isMatch = this.#firstCard.dataset.id === this.#secondCard.dataset.id;
    if (isMatch) {
      this.#disableCards();
    } else {
      this.#unflipCards();
    }
  }

  /**
   * Laisse les cartes retournées.
   */
  #disableCards() {
    if (this.#onMatchCallback) {
      this.#onMatchCallback();
    }
    this.#resetBoard();
  }

  /**
   * Retourne les deux cartes.
   */
  #unflipCards() {
    this.#lockBoard = true;
    setTimeout(() => {
      this.#firstCard.classList.remove('flip');
      this.#secondCard.classList.remove('flip');
      if (this.#onMismatchCallback) {
        this.#onMismatchCallback();
      }
      this.#resetBoard();
    }, 1000);
  }

  /**
   * Retourne toutes les cartes
   */
  unflipAllCards() {
    const oldLockState = this.#lockBoard;
    this.#lockBoard = true;
    const gameBoard = document.querySelector(".game-board");
    if (!gameBoard) return;
    const cards = Array.from(document.querySelectorAll(".card"));
    const playableCards = cards.filter(card => !card.classList.contains('flip'));

    if (playableCards.length === 0) return;
    playableCards.forEach(card => card.classList.add('flip'));
    setTimeout(() => {
      playableCards.forEach(card => card.classList.remove('flip'));
      this.#lockBoard = oldLockState;
    }, 500);
  }

  /**
   * Réinitialise le plateau de jeu
   */
  #resetBoard() {
    [this.#firstCard, this.#secondCard] = [null, null];
    this.#lockBoard = false;
  }

  /**
   * Ajoute le formulaire sur la page
   */
  createFrom() {
    const form = document.createElement('form');
    form.setAttribute('class', 'game-form');

    const labelName = document.createElement('label');
    labelName.htmlFor = 'name';
    labelName.textContent = 'Votre pseudo :';
    form.append(labelName);
    const name = document.createElement('input');
    name.setAttribute('type', 'text');
    name.setAttribute('name', 'name');
    name.setAttribute('id', 'name');
    form.append(name);

    const labelDiffLevel = document.createElement('label');
    labelDiffLevel.htmlFor = 'difficulty';
    labelDiffLevel.textContent = 'Choisissez une difficulté :';
    form.append(labelDiffLevel);
    const diffLevel = this.#createNivDiff();
    form.append(diffLevel);

    const labelImgChoices = document.createElement('label');
    labelImgChoices.htmlFor = 'theme';
    labelImgChoices.textContent = 'Choisissez un thème :';
    form.append(labelImgChoices);
    const imgChoi = this.#createChoixImg();
    form.append(imgChoi);

    const labelModeChoices = document.createElement('label');
    labelModeChoices.htmlFor = 'mode';
    labelModeChoices.textContent = 'Choisissez un mode de jeu:';
    form.append(labelModeChoices);
    const modeChoi = this.#createChoixMode();
    form.append(modeChoi);


    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.innerText = 'Jouer';
    form.append(button);

    const descriptionsDiv = this.#createDescriptions();
    form.append(descriptionsDiv);

    document.querySelector('.setup-form').append(form);
  }

  /**
   * Créé une liste déroulante de difficulté
   * @return {HTMLSelectElement} niveauDiff la liste déroulante créée
   */
  #createNivDiff() {
    const diffLevel = document.createElement('select');
    diffLevel.setAttribute('name', 'difficulty');
    diffLevel.setAttribute('id', 'difficulty');

    const option4 = document.createElement('option');
    option4.setAttribute('value', '4');
    option4.innerText = '4 paires (Facile)';
    diffLevel.append(option4);

    const option5 = document.createElement('option');
    option5.setAttribute('value', '5');
    option5.innerText = '5 paires (Moyen)';
    diffLevel.append(option5);

    const option6 = document.createElement('option');
    option6.setAttribute('value', '6');
    option6.innerText = '6 paires (Difficile)';
    diffLevel.append(option6);

    const option8 = document.createElement('option');
    option8.setAttribute('value', '8');
    option8.innerText = '8 paires (Extrème)';
    diffLevel.append(option8);

    return diffLevel;
  }

  /**
   * Créé une liste déroulante pour les choix des images
   * @returns {HTMLSelectElement} choixImage la liste déroulante créée
   */
  #createChoixImg() {
    const imgChoice = document.createElement('select');
    imgChoice.setAttribute('name', 'theme');
    imgChoice.setAttribute('id', 'theme');

    const optionAn = document.createElement('option');
    optionAn.setAttribute('value', 'animals');
    optionAn.innerText = 'Animaux';
    imgChoice.append(optionAn);

    const optionCar = document.createElement('option');
    optionCar.setAttribute('value', 'cars');
    optionCar.innerText = 'Voitures';
    imgChoice.append(optionCar);

    const optionFruit = document.createElement('option');
    optionFruit.setAttribute('value', 'fruits');
    optionFruit.innerText = 'Fruits';
    imgChoice.append(optionFruit);

    return imgChoice;
  }

  /**
   * Créé une liste déroulante pour les choix du mode
   * @returns {HTMLSelectElement} choixMode la liste déroulante créée
   */
  #createChoixMode() {
    const modeChoice = document.createElement('select');
    modeChoice.setAttribute('name', 'mode');
    modeChoice.setAttribute('id', 'mode');

    const optionBas = document.createElement('option');
    optionBas.setAttribute('value', 'basique');
    optionBas.innerText = 'Basique';
    modeChoice.append(optionBas);

    const optionLife = document.createElement('option');
    optionLife.setAttribute('value', 'vie');
    optionLife.innerText = 'Vies limitées';
    modeChoice.append(optionLife);

    const optionTime = document.createElement('option');
    optionTime.setAttribute('value', 'time');
    optionTime.innerText = 'Temps limité';
    modeChoice.append(optionTime);

    const optionShuffle = document.createElement('option');
    optionShuffle.setAttribute('value', 'melange');
    optionShuffle.innerText = 'Mélange à chaque paire';
    modeChoice.append(optionShuffle);

    return modeChoice;
  }

  /**
   * Crée la zone de texte expliquant les modes et le bouton indice
   * @returns {HTMLDivElement}
   */
  #createDescriptions() {
    const container = document.createElement('div');
    container.classList.add('game-rules');

    const title = document.createElement('h3');
    title.textContent = 'Règles & Modes de jeu';
    container.append(title);

    const ul = document.createElement('ul');

    const rules = [
      "<strong>Basique :</strong> Trouvez toutes les paires le plus vite possible.",
      "<strong>Vies limitées :</strong> Chaque erreur vous coûte une vie. Si vous tombez à 0, c'est perdu !",
      "<strong>Temps limité :</strong> Battez le chronomètre ! Vous avez un temps précis selon la difficulté.",
      "<strong>Mélange à chaque paire :</strong> Dès qu'une paire est trouvée, les cartes restantes changent de place.",
      "<strong>Bouton Indice :</strong> Une fois par partie, il retourne toutes les cartes cachées pendant 1 seconde pour vous aider."
    ];

    rules.forEach(rule => {
      const li = document.createElement('li');
      li.innerHTML = rule;
      ul.append(li);
    });

    container.append(ul);
    return container;
  }
}