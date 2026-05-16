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
   * Retourne les cartes.
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

    const labelNivDiff = document.createElement('label');
    labelNivDiff.htmlFor = 'difficulty';
    labelNivDiff.textContent = 'Choisissez une difficulté :';
    form.append(labelNivDiff);
    const niveauDiff = this.#createNivDiff();
    form.append(niveauDiff);

    const labelChoixImg = document.createElement('label');
    labelChoixImg.htmlFor = 'theme';
    labelChoixImg.textContent = 'Choisissez un thème :';
    form.append(labelChoixImg);
    const choixImage = this.#createChoixImg();
    form.append(choixImage);

    const labelChoixMode = document.createElement('label');
    labelChoixMode.htmlFor = 'mode';
    labelChoixMode.textContent = 'Choisissez un mode de jeu:';
    form.append(labelChoixMode);
    const choixMode = this.#createChoixMode();
    form.append(choixMode);

    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.innerText = 'Jouer';
    form.append(button);

    document.querySelector('.setup-form').append(form);
  }

  /**
   * Créé une liste déroulante de difficulté
   * @return {HTMLSelectElement} niveauDiff la liste déroulante créée
   */
  #createNivDiff() {
    const niveauDiff = document.createElement('select');
    niveauDiff.setAttribute('name', 'difficulty');
    niveauDiff.setAttribute('id', 'difficulty');

    const option4 = document.createElement('option');
    option4.setAttribute('value', '4');
    option4.innerText = '4 paires (Facile)';
    niveauDiff.append(option4);

    const option5 = document.createElement('option');
    option5.setAttribute('value', '5');
    option5.innerText = '5 paires (Moyen)';
    niveauDiff.append(option5);

    const option6 = document.createElement('option');
    option6.setAttribute('value', '6');
    option6.innerText = '6 paires (Difficile)';
    niveauDiff.append(option6);

    const option8 = document.createElement('option');
    option8.setAttribute('value', '8');
    option8.innerText = '8 paires (Extrème)';
    niveauDiff.append(option8);

    return niveauDiff;
  }

  /**
   * Créé une liste déroulante pour les choix des images
   * @returns {HTMLSelectElement} choixImage la liste déroulante créée
   */
  #createChoixImg() {
    const choixImage = document.createElement('select');
    choixImage.setAttribute('name', 'theme');
    choixImage.setAttribute('id', 'theme');

    const optionAn = document.createElement('option');
    optionAn.setAttribute('value', 'animals');
    optionAn.innerText = 'Animaux';
    choixImage.append(optionAn);

    const optionCar = document.createElement('option');
    optionCar.setAttribute('value', 'cars');
    optionCar.innerText = 'Voitures';
    choixImage.append(optionCar);

    const optionFruit = document.createElement('option');
    optionFruit.setAttribute('value', 'fruits');
    optionFruit.innerText = 'Fruits';
    choixImage.append(optionFruit);

    return choixImage;
  }

  /**
   * Créé une liste déroulante pour les choix du mode
   * @returns {HTMLSelectElement} choixMode la liste déroulante créée
   */
  #createChoixMode() {
    const choixMode = document.createElement('select');
    choixMode.setAttribute('name', 'mode');
    choixMode.setAttribute('id', 'mode');

    const optionBas = document.createElement('option');
    optionBas.setAttribute('value', 'basique');
    optionBas.innerText = 'Basique';
    choixMode.append(optionBas);

    const optionVie = document.createElement('option');
    optionVie.setAttribute('value', 'vie');
    optionVie.innerText = 'Vies limitées';
    choixMode.append(optionVie);

    const optionTime = document.createElement('option');
    optionTime.setAttribute('value', 'time');
    optionTime.innerText = 'Temps limité';
    choixMode.append(optionTime);

    return choixMode;
  }
}