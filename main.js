const uploadButton = document.querySelector('.file-label');
const fileInput = document.querySelector('.file-image');
const cardArea = document.querySelector('.foto-feed');
const albumBtn = document.querySelector('.add-to-album');
const favButton = document.querySelector('.card-fav');
const viewFavButton = document.querySelector('.favorite-button');
const searchInput = document.querySelector('.search-input');
const titleInput = document.querySelector('.title-input');
const captionInput = document.querySelector('.caption-input');
const showMoreBtn = document.querySelector('.show-more');
const showLessBtn = document.querySelector('.show-less-button')
const moreLessBtn = document.querySelector('.show-more-or-less');
const changeImage = document.querySelector('.change-image');
const fotoFeed = document.querySelector('.foto-feed');
const body = document.querySelector('body');
const cards = document.querySelector('card');
const inputs = document.querySelectorAll('.inputs');
const reader = new FileReader();
const photoArray = [];

window.onload = init;
albumBtn.addEventListener('click', saveImage);
cardArea.addEventListener('click', clickedCardArea);
cardArea.addEventListener('focusout', editPhotoText);
cardArea.addEventListener('keypress', editPhotoText);
fileInput.addEventListener('change', uploadFile);
searchInput.addEventListener('keyup', searchForCards)
viewFavButton.addEventListener('click', (filterFavs));
uploadButton.addEventListener('click', fileInputClick);
changeImage.addEventListener('change', switchImage);

function init() {
  loadLocalStorage();
  showOnlyTen();
  anyCards();
  updateFavButtonCount();
}

function loadLocalStorage() {
  if (localStorage.getItem('imgs') !== null) {
    const tempImgsArr = JSON.parse(localStorage.getItem('imgs'));
    tempImgsArr.forEach(ele => {
      const card = new Photo(ele.id, ele.title, ele.caption, ele.file, ele.favorite);
      addToDOM(card);
      photoArray.push(card);
    });
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

function clickedCardArea(e) {
  if (e.target.closest('.card-fav')) favBtn(e);
  if (e.target.closest('.card-trash')) deleteBtn(e);
  if (e.target.closest('.card-img')) cardImg(e);
}

function cardImg(e) {
  photoArray.get.changeImgId = e.target.closest('.card').dataset.id;
  changeImage.click();
}

function deleteBtn(e) {
  e.target.src = e.target.attributes.src.value == 'images/delete-active.svg' ? 'images/delete.svg' : 'images/delete-active.svg';
}

function favBtn(e) {
  const id = e.target.closest('.card').dataset.id;
  const idx = photoArray.findIndex(e => e.id == id);
  const fav = !photoArray[idx].favorite;

  e.target.src = fav ? 'images/favorite-active.svg' : 'images/favorite.svg';
  photoArray[idx].favorite = fav;
  updateFavButtonCount();
  photoArray[idx].saveToStorage(photoArray);
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
    return arrayAlter(images, photoArray);
  }
}

function switchImage() {
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

// function deleteImage(e) {
//   if (e.target.closest('.card-trash')) {
//     e.target.src = e.target.attributes.src.value == 'images/delete-active.svg' ? 'images/delete.svg' : 'images/delete-active.svg';
//   }
// }

function clickedFavButton(e) {
  const id = e.target.closest('.card').dataset.id;
  const index = photoArray.findIndex(e => e.id == inId);
  const favorite = photoArray[index].favorite;

  e.target.src = favorite ? 'images/favorite-active.svg' : 'images/favorite.svg';
  photoArray[index].favorite = favorite;
  updateFavButtonCount();
  photoArray[index].saveToStorage(photoArray);
}

function saveImage(e) {
  e.preventDefault();
  photoArray.showPhotos();
}

function searchForCards() {
  removeCardsFromDOM();
  let search = searchInput.value.toUpperCase();
  let filteredPhotos = photoArray.filter( photo => {
  let cardTitle = photo.title.toUpperCase();
  let cardCaption = photo.caption.toUpperCase();
  return  cardCaption.includes(search) || cardTitle.includes(search);
});
// cardArea.innerHTML = '';
filteredPhotos.forEach(function(filteredPhoto) {
  addToDOM(filteredPhoto);
});
  }
  // displayFilter();

function showOnlyTen() {
  removeCardsFromDOM();
  photoArray.filter((idea, index) => {
    return index >= photoArray.length - 10;
  }).forEach(idea => addToDOM(idea));
}

function showAll() {
  photoArray.forEach(val => addToDOM(val));
}

function showFavorite() {
  const favCards = photoArray.filter(e => {
    return e.favorite;
  })
  favCards.forEach(e => addToDOM(e));
}

function uploadFile(e) {
  checkCanSubmit();
  upload(fileInput.files);
}

function updateFavButtonCount() {
  const favs = photoArray.filter(e => e.favorite === true).length;
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

function deleteCard(cardId) {
  var thisCard = document.querySelector(`.card[data-id="${cardId}"]`);
  console.log(thisCard);
  thisCard.remove();
  var deletedPhoto = photoArray.find((photo)=> {
    return cardId === photo.id;
  });
  deletedPhoto.deleteFromStorage(photoArray, deletedPhoto.id);
}

function stage(file) {
  const lastElementIndex = photoArray.length - 1;
  let id = 0;
  if (photoArray.length > 0) {
    id = parseInt(photoArray[lastElementIndex].id) + 1;
  }
  const title = titleInput.value;
  const caption = captionInput.value;
  const newImg = new Photo(id, title, caption, file, false);
  return newImg;
}

function showMore(e) {
  removeCardsFromDOM();
  photoArray.forEach(img => addToDOM(img));
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
  photoArray[findIndex(id)].updatePhoto(src, photoArray);

}

function findIndex(id) {
  return photoArray.findIndex(obj => obj.id == id);
}

function editPhotoText(event) {
  let cardId = event.target.closest('.card').dataset.id;
  let title = document.querySelector(`.card[data-id='${cardId}'] .card-title`).innerText;
  let caption = document.querySelector(`.card[data-id='${cardId}'] .card-desc`).innerText;
  if (event.keyCode === 13) {
    photoArray.forEach(card => {
      if (card.id == cardId) {
        card.title = title;
        card.caption = caption;
        card.saveToStorage(photoArray);
      }
    });
    event.target.blur();
  }

  if (event.target.classList.contains('card-title') ||
    event.target.classList.contains('card-desc')) {
    photoArray.forEach(card => {
      if (card.id == cardId) {
        card.title = title;
        card.caption = caption;
        card.saveToStorage(photoArray);
      }
    });
  }
}

function upload(files, image) {
  if (!image) {
    reader.readAsDataURL(files[0]);
    reader.onload = createPhoto;
  } else {
    reader.readAsDataURL(changeImage.files[0]);
  }
}

function createPhoto (event) {
  event.preventDefault();
  const newPhoto = new Photo (Date.now(), titleInput.value, captionInput.value, event.target.result, false);
  photoArray.push(newPhoto);
  newPhoto.saveToStorage(photoArray);
  addToDOM(newPhoto);
}

function addToDOM(photo) {
  let tempFav = photo.favorite ? 'favorite-active.svg' : 'favorite.svg';
  
  fotoFeed.insertAdjacentHTML('afterbegin',
  `
    <section class="card" data-id="${photo.id}">
    <p class="card-title searchable" contenteditable="true">${photo.title}</p>
      <img src="${photo.file}" class="card-img">
      <p class="card-desc searchable" contenteditable="true">${photo.caption}</p>
      <footer>
        <img onclick="deleteCard(${photo.id})" class="card-trash" src="images/delete.svg">
        <img class="card-fav" src="images/${tempFav}">
      </footer>
    </section>
  `);
  clearInputs();
}

function clearInputs () {
  titleInput.value = '';
  captionInput.value = '';
}

function checkCanSubmit() {
  let titleLength = titleInput.value.length;
  let captionLength = captionInput.value.length;
  let inputLength = fileInput.files.length;
  albumBtn.disabled = titleLength < 1 || captionLength < 1 || inputLength === 0;
  return !albumBtn.disabled;
}
