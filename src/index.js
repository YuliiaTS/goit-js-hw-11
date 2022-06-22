import ImagesApiService from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchFormEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.search-form__input');
const searchBtn = document.querySelector('.search-form__btn');
const galeryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const imagesApiService = new ImagesApiService();

searchFormEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

loadMoreBtn.classList.add('is-hidden');

let lightBox = null;

async function onSearch(e) {
  e.preventDefault();
  imagesApiService.qwery = inputEl.value;
  imagesApiService.resetPage();
  if (imagesApiService.qwery !== '') {
    galeryEl.innerHTML = '';
    try {
      const resolve = await imagesApiService.fetchImages();
      const imgArray = resolve.data.hits;

      if (imgArray.length === 0) {
        galeryEl.innerHTML = '';
        loadMoreBtn.classList.add('is-hidden');
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else {
        galeryEl.innerHTML = ImgCardRender(imgArray);
        loadMoreBtn.classList.remove('is-hidden');
        Notify.success(`Hooray! We found ${resolve.data.totalHits} images.`);
      }

      imagesApiService.nextPage += 1;

      addLightBox();

      return imgArray;
    } catch (error) {
      console.log(error);
    }
  }
}

async function onLoadMoreBtnClick() {
  imagesApiService.qwery = inputEl.value;
  try {
    const response = await imagesApiService.fetchImages();
    const imgsArray = response.data.hits;
    console.log(imgsArray);
    if (imgsArray.length === 0) {
      Notify.failure("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('is-hidden');
    } else {
      galeryEl.insertAdjacentHTML('beforeend', ImgCardRender(imgsArray));
    }
    
    imagesApiService.nextPage += 1;

    addLightBox();

    scroll();

    return imgsArray;
  } catch (error) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.classList.add('is-hidden');
    console.log(error);
  }
}

function ImgCardRender(arrey) {
  return arrey
  .map(({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
}) => `<div class="photo-card">
    <a class="photo-card__link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
            <p class="info-item">
            <b>Likes <span>${likes}</span></b>
            </p>
            <p class="info-item">
            <b>Views <span>${views}</span></b>
            </p>
            <p class="info-item">
            <b>Comments <span>${comments}</span></b>
            </p>
            <p class="info-item">
            <b>Downloads <span>${downloads}</span></b>
            </p>
        </div>
    </div>`
).join('');
}

function addLightBox() {
  lightBox = new SimpleLightbox('.gallery a', {
    captionDelay: '250ms',
    captionsData: 'alt',
  });
}

function scroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}
