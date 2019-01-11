const uploadButton = document.querySelector('.file-label');
const fileInput = document.querySelector('.file-image');
const cardArea = document.querySelector('.foto-feed');
const albumBtn = document.querySelector('.add-to-album');
const favButton = document.querySelector('.card-fav');
const viewFavButton = document.querySelector('.favorite-button');
const searchEle = document.querySelector('.search');
const showMoreBtn = document.querySelector('.show-more');
const showLessBtn = document.querySelector('.show-less-button')
const moreLessBtn = document.querySelector('.show-more-or-less');
const changeImage = document.querySelector('.change-image');
const fotoFeed = document.querySelector('.foto-feed');
const body = document.querySelector('body');
const cards = document.querySelector('card');
const inputs = document.querySelectorAll('.inputs');
const reader = new FileReader();
const images = photos();
const photoArray = [];

window.onload = init;
albumBtn.addEventListener('click', saveImage);
cardArea.addEventListener('mouseout', mouseOut);
cardArea.addEventListener('mouseup', (e) => deleteOut(e));
cardArea.addEventListener('click', clickedCardArea);
cardArea.addEventListener('mousedown', deleteImage);
cardArea.addEventListener('focusout', editPhotoText);
cardArea.addEventListener('keypress', editPhotoText);
fileInput.addEventListener('change', uploadFile);
reader.addEventListener('load', () => images().add(reader.result));
searchEle.addEventListener('keyup', search)
viewFavButton.addEventListener('click', (filterFavs));
uploadButton.addEventListener('click', fileInputClick);

changeImage.addEventListener('change', switchImage);
body.addEventListener('click', clickedBody);
inputs.forEach(e => {
  e.addEventListener('keyup', () => {
    checkCanSubmit();
  })
});

function init() {
  loadLocalStorage();
  showOnlyTen();
  anyCards();
  updateFavButtonCount();
}

function arrayAlter(image, photoArray) {
  return {
    add: (file) => imagesVariables[0].stagedImg = stage(file),
    remove: (id) => remove(id),
    get: imagesVariables[1],
    asArray: () => (photoArray),
    showPhotos: () => showPhotos(images, photoArray)
  }
}

function anyCards() {
  if (fotoFeed.childElementCount < 1) {
    const noCards = document.createElement('h1');
    noCards.classList.add('center-text');
    noCards.innerText = 'Add Albums...';
    fotoFeed.appendChild(noCards);
  }
}

function clickedBody(e) {
  if (e.target.closest(moreLessBtn)) {
    showMoreOrLess(e);
  }
}

function clickedCardArea(e) {
  if (e.target.closest('.card-fav')) favBtn(e);
  if (e.target.closest('.card-trash')) deleteBtn(e);
  if (e.target.closest('.card-img')) cardImg(e);
}

function cardImg(e) {
  images().get.changeImgId = e.target.closest('.card').dataset.id;
  changeImage.click();
}

function deleteBtn(e) {
  e.target.src = e.target.attributes.src.value == 'imgs/delete-active.svg' ? 'imgs/delete.svg' : 'imgs/delete-active.svg';
}

function favBtn(e) {
  const id = e.target.closest('.card').dataset.id;
  const idx = images().asArray().findIndex(e => e.id == id);
  const fav = !images().asArray()[atThisIndex].favorite;

  e.target.src = fav ? 'imgs/favorite-active.svg' : 'imgs/favorite.svg';
  images().asArray()[idx].favorite = fav;
  updateFavButtonCount();
  images().asArray()[idx].saveToStorage(images().asArray());
}

function fileInputClick(e) {
  e.preventDefault();
  fileInput.click();
}

function photos() {
  const photoArray = [];
  const images = [{
    stagedImg: 0
  }, {
    changeImgId: 0
  }]
  return () => {
    return arrayAlter(image, photoArray);
  }
}

function SwitchImage() {
  upload(changeImage.files, true);
}

function filterFavs(e) {
  e.preventDefault();
  removeCardsFromDOM();
  if (viewFavButton.innerText.includes('View')) {
    showFavorite();
    viewFavButton.innerText = 'Show All';
  } else {
    updateFavButtonCount();
    showAll();
  }
}

function loadLocalStorage() {
  if (localStorage.getItem('imgs') !== null) {
    const tempImgsArr = JSON.parse(localStorage.getItem('imgs'));
    tempImgsArr.forEach(ele => {
      const tempCard = new Photo(ele.id, ele.title, ele.caption, ele.file, ele.favorite);
      images().asArray().push(tempCard);
    });
  }
}

function deleteImage(e) {
  if (e.target.closest('.card-trash')) {
    e.target.src = e.target.attributes.src.value == 'imgs/delete-active.svg' ? 'imgs/delete.svg' : 'imgs/delete-active.svg';
  }
}

function mouseOut(clicked) {
  if (clicked.target.closest('.card-trash')) {
    clicked.target.src = 'imgs/delete.svg';
  }
}

function deleteOut(e) {
  if (e.target.closest('.card-trash') &&
    e.target.attributes.src.value === 'imgs/delete-active.svg') {
    images().remove(e.target.closest('.card').dataset.id);
    e.target.closest('.card').remove();
    anyCards();
  }
  updateFavButtonCount();
}

function saveImage(e) {
  e.preventDefault();
  images().showPhotos();
}

function search() {
  removeCardsFromDOM();
  const isNotFavView = viewFavButton.innerText.includes('View');
  if (isNotFavView) {
    showAll();
  } else {
    showFavorite();
  }
  displayFilter();
}

function showOnlyTen() {
  removeCardsFromDOM();
  images().asArray().filter((idea, index) => {
    return index >= images().asArray().length - 10;
  }).forEach(idea => addToDOM(idea));
}

function showAll() {
  images().asArray().forEach(e => addToDOM(e));
}

function displayFilter() {
  cards.forEach(obj => {
    !obj.innerText.includes(event.target.value) &&
      obj.closest('.card').remove();
  });
}

function showFavorite() {
  const favCards = images().asArray().filter(e => {
    return e.favorite;
  })
  favCards.forEach(e => addToDOM(e));
}

function uploadFile(e) {
  checkCanSubmit();
  upload(fileInput.files);
}

function updateFavButtonCount() {
  const favs = images().asArray().filter(e => e.favorite === true).length;
  viewFavButton.innerText = `View ${favs} Favorites`;
}

function showPhotos(images, photoArray) {
  fotoFeed.innerHTML = '';
  if (images[0].stagedImg) {
    photoArray.push(images[0].stagedImg);
  }
  images[0].stagedImg.saveToStorage(photoArray);
  photoArray.forEach(e => {
    addToDOM(e)
    checkCanSubmit();
  });
  clearInput();
}

function clearInput() {
  fileInput.value = '';
}

function remove(id) {
  const imgArr = images().asArray();
  const tempIndex = findIndex(id);
  imgArr[tempIndex].deleteFromStorage(imgArr, tempIndex);
}

function stage(file) {
  const lastElementIndex = images().asArray().length - 1;
  let id = 0;
  if (images().asArray().length > 0) {
    id = parseInt(images().asArray()[lastElementIndex].id) + 1;
  }
  const title = titleInput.value;
  const caption = captionInput.value;
  const newImg = new Photo(id, title, caption, file, false);
  return newImg;
}

function showMore(e) {
  removeCardsFromDOM();
  images().asArray().forEach(img => addToDOM(img));
  showMoreBtn.classList.value = 'show-less-button';
  showLessBtn.innerText = 'Show Less';
  updateFavButtonCount();
}

function showLess(e) {
  showOnlyTen();
  showLessBtn.classList.value = 'show-more-button';
  showLessBtn.innerText = 'Show More';
  updateFavButtonCount();
}

function showMoreOrLess(e) {
  if (e.target.classList.contains('show-more-button')) {
    showMore(e)
  } else if (e.target.classList.contains(showLessBtn)) {
    showLess(e)
  }
  return true;
}

function removeCardsFromDOM() {
  fotoFeed.innerHTML = '';
}

function changeCardImg(id, src) {
  document.querySelector(`.card[data-id='${id}'] img`).src = src;
  images().asArray()[findIndex(id)].updatePhoto(src, images().asArray());

}

function findIndex(id) {
  return images().asArray().findIndex(obj => obj.id == id);
}

function editPhotoText(event) {
  let cardId = event.target.closest('.card').dataset.id;
  let title = document.querySelector(`.card[data-id='${cardId}'] .card-title`).innerText;
  let caption = document.querySelector(`.card[data-id='${cardId}'] .card-desc`).innerText;
  if (event.keyCode === 13) {
    images().asArray().forEach(card => {
      if (card.id == cardId) {
        card.title = title;
        card.caption = caption;
        card.saveToStorage(images().asArray());
      }
    });
    event.target.blur();
  }

  if (event.target.classList.contains('card-title') ||
    event.target.classList.contains('card-desc')) {
    images().asArray().forEach(card => {
      if (card.id == cardId) {
        card.title = title;
        card.caption = caption;
        card.saveToStorage(images().asArray());
      }
    });
  }
}

function upload(files, image) {
  if (!image) {
    reader.readAsDataURL(files[0]);
  } else {
    reader2.readAsDataURL(changeImage.files[0]);
  }
}

function addToDOM(photo) {
  const tempFav = photo.favorite ? 'favorite-active.svg' : 'favorite.svg';
  titleInput.value = '';
  captionInput.value = '';
  newIdea.classList.add('card');
  newIdea.dataset.id = photo.id;
  newIdea.src = newIdea.file;
  newIdea.innerHTML = `\
  <section>
    <p class="card-title searchable" contenteditable="true">${photo.title}</p>
    <img src="${img.file}"  alt="images upload from users" class="card-img">
    <p class="card-desc searchable" contenteditable="true">${photo.caption}</p>
    <footer>
      <img class="card-trash" src="images/delete.svg">
      <img class="card-fav" src="images/${tempFav}">
    </footer>
  </section>`;
  fotoFeed.prepend(newIdea);
}

function checkCanSubmit() {
  let titleLength = titleInput.value.length;
  let captionLength = captionInput.value.length;
  let inputLength = fileInput.files.length;
  albumBtn.disabled = titleLength < 1 || captionLength < 1 || inputLength === 0;
  return !albumBtn.disabled;
}
