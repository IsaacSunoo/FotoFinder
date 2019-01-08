class Photo {
  constructor(id, title, caption, file, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  }

  saveToStorage() {
    localStorage.setItem(this.id, JSON.stringify(this));
  }

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  }

  updatePhoto(updatedContent, type) {
    console.log("Update content: " + this);
    if (type === 'title') {
      this.title = updatedContent;
    } else if (type === 'body') {
      this.body = updatedContent;
    }
  }

}
