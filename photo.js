class Photo {
  constructor(id, title, caption, file, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file || 'nothing';
    this.favorite = favorite || false;
  }

  saveToStorage(photos) {
    localStorage.setItem('imgs', JSON.stringify(photos));
  }

  deleteFromStorage(photos, id) {
    let index = photos.findIndex(function(photo){
      return id === photo.id;
    });
    photos.splice(index, 1);
    this.saveToStorage(photos);
  }

  updatePhoto(file, photos) {
    this.file = file;
    this.saveToStorage(photos);
  }
}
