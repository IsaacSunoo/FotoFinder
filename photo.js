class Photo {
  constructor(id, title, caption, file, fav) {
    this.id = id;
    this.title = title;
    this.caption = inCaption;
    this.file = inURL || 'nothing';
    this.favorite = inFav || false;
  }

  saveToStorage(photos, new) {
    localStorage.setItem('imgs', JSON.stringify(photos));
  }

  deleteFromStorage(photos, index) {
    imgArr.splice(index, 1);
    this.saveToStorage(photos);
  }

  updatePhoto(file, photos) {
    this.file = file;
    this.saveToStorage(photos);
  }
}
