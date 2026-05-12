export class DOMManager {


  /**
   * Ajoute toutes les images d'une collection sur le gameBoard
   * @param {Image[]} images
   */
  createCards(images) {
    const gameBoard = document.querySelector('.game-board');
    if(!gameBoard) return;
    gameBoard.innerHTML = '';
    if (images.length > 12) {
      gameBoard.classList.add('cols-5');
    } else {
      gameBoard.classList.remove('cols-5');
    }
    images.forEach(image => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="./assets/images/mask1.jpg" alt="Carte cachée">
          </div>
          <div class="card-back hidden">
            <img src="${image.url}" alt="${image.name}">
          </div>
        </div>
      `;

      // TODO: Ajouter l'événement 'click' ici plus tard pour retourner la carte
      // card.addEventListener('click', () => { ... });

      gameBoard.appendChild(card);
    });

    /**
     * Voici un exemple de contenu de card permettant de contenir une partie masqué
     * et l'image qui doit être révélée.
     *
     <div class="card-inner">
     <div class="card-front">
     <img src="./assets/images/mask1.jpg" alt="Hidden card">
     </div>
     <div class="card-back hidden">
     <img src="${image.url}" alt="${image.name}">
     </div>
     </div>
     */

  }
}

/**
 * Ajoute le formulaire sur la page
 */
export function createFrom(){
  const form = document.createElement('form');
  form.setAttribute('class','game-form');

  const labelName = document.createElement('label');
  labelName.htmlFor = 'name';
  labelName.textContent = 'Votre pseudo :';
  form.append(labelName);
  const name = document.createElement('input');
  name.setAttribute('type','text');
  name.setAttribute('name','name');
  name.setAttribute('id','name');
  form.append(name);

  const labelNivDiff = document.createElement('label');
  labelNivDiff.htmlFor = 'difficulty';
  labelNivDiff.textContent = 'Choisissez une difficulté :';
  form.append(labelNivDiff);
  const niveauDiff = createNivDiff();
  form.append(niveauDiff);

  const labelChoixImg= document.createElement('label');
  labelChoixImg.htmlFor = 'theme';
  labelChoixImg.textContent = 'Choisissez un thème :';
  form.append(labelChoixImg);
  const choixImage = createChoixImg();
  form.append(choixImage);

  const button = document.createElement('button');
  button.setAttribute('type','submit');
  button.innerText = 'Jouer';
  form.append(button);

  document.querySelector('.setup-form').append(form);
}

/**
 * Créé une liste déroulante de difficulté
 * @return {HTMLSelectElement} niveauDiff la liste déroulante créée
 */
function createNivDiff() {
  const niveauDiff = document.createElement('select');
  niveauDiff.setAttribute('name', 'difficulty');
  niveauDiff.setAttribute('id', 'difficulty');

  const option4 = document.createElement('option');
  option4.setAttribute('value','4');
  option4.innerText = '4 paires (Facile)';
  niveauDiff.append(option4);

  const option5 = document.createElement('option');
  option5.setAttribute('value','5');
  option5.innerText = '5 paires (Moyen)';
  niveauDiff.append(option5);

  const option6 = document.createElement('option');
  option6.setAttribute('value','6');
  option6.innerText = '6 paires (Difficile)';
  niveauDiff.append(option6);

  const option8 = document.createElement('option');
  option8.setAttribute('value','8');
  option8.innerText = '8 paires (Extrème)';
  niveauDiff.append(option8);

  return niveauDiff;
}

/**
 * Créé une liste déroulante pour les choix des images
 * @returns {HTMLSelectElement} choixImage la liste déroulante créé
 */
function createChoixImg(){
  const choixImage = document.createElement('select');
  choixImage.setAttribute('name', 'theme');
  choixImage.setAttribute('id', 'theme');

  const optionAn = document.createElement('option');
  optionAn.setAttribute('value','animals');
  optionAn.innerText = 'Animaux';
  choixImage.append(optionAn);

  const optionCar = document.createElement('option');
  optionCar.setAttribute('value','cars');
  optionCar.innerText = 'Voitures';
  choixImage.append(optionCar);

  const optionFruit = document.createElement('option');
  optionFruit.setAttribute('value','fruits');
  optionFruit.innerText = 'Fruits';
  choixImage.append(optionFruit);

  return choixImage;
}

