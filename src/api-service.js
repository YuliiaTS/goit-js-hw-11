const axios = require('axios');

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }
  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = 'key=27491202-6941cbc6cc49fba95622056d0';
    return await axios.get(
      ` ${BASE_URL}?${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`
    );
  }

  resetPage() {
    this.page = 1;
  }

  get qwery() {
    return this.searchQuery;
  }
  set qwery(newQwery) {
    this.searchQuery = newQwery;
  }
  get nextPage() {
    return this.page;
  }
  set nextPage(newPage) {
    this.page = newPage;
  }
}
