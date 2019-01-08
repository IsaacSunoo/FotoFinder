const titleInput = document.querySelector('.title-input');
const captionInput = document.querySelector('.caption-input');
const fileBtn = document.querySelector('.file-btn');
const favoriteBtn = document.querySelector('.favorite-btn');
const albumBtn = document.querySelector('.add-album-btn');
const chooseFile = document.querySelector('.submit-btn');
const fotoFeed = document.querySelector('.foto-feed');

const photoArray = [];

const reader = new FileReader();


window.onload = init;

function init() {
  loadLocalStorage();
}

function loadLocalStorage() {
  console.log("loaded local storage");
  if (localStorage.getItem('cards') !== null) {
    const fotoArray = JSON.Parse(localStorage.getItem('cards'));
    fotoArray.forEach(val => {
      let card = new Photo(val.id, val.title, val.caption, val.file, val.favorite);
      images().asArray().push(card);
    })
  }
}
