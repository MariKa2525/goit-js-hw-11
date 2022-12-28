import './css/styles.css';
import  fetchImages  from './fetchImages.js';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    galleryList: document.querySelector('.gallery'),
    searchForm: document.querySelector('#search-form'),
    loadMoreBtn: document.querySelector('.load-more'),
}

let searchQuery = '';
let gallery = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);

window.addEventListener('scroll', onScroll)

disabledBtn()

function onSearch(evt) {
    evt.preventDefault();
    searchQuery = evt.currentTarget.elements.searchQuery.value;
    if (searchQuery === '') {
            return;
        }
    showData();
}

async function showData(arrdata) {
    try {
        const data = await fetchImages(searchQuery, true);
        const hits = data.hits;
    if (hits.length === 0) {
        clearGalleryList();
        Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query. Please try again."
        )
        searchQuery = ''
        // disabledBtn()

    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    })
        return ;
    } 
    clearGalleryList();
    addToGallery(hits);
    
    // removeBtn();

    new SimpleLightbox('.gallery a', {
        captions: true,
        captionsDelay: 250,
    });
    } catch (error) {
    console.log("Erorr", error);
    } finally {
        refs.searchForm.reset();
    }
}

function disabledBtn() {
    refs.loadMoreBtn.classList.add('is-hidden')
}

// function removeBtn() {
//     refs.loadMoreBtn.classList.remove('is-hidden')
// }

async function onScroll() {
        const heightUser = window.screen.height;
        const {height} = document.documentElement.getBoundingClientRect()
        const topScroll = document.documentElement.scrollTop
  
        if(topScroll > (height - heightUser) ) {

            window.removeEventListener('scroll', onScroll)
            const {hits, totalHits} = await fetchImages(searchQuery)
            addToGallery(hits)
            Notiflix.Notify.success(
                `"Hooray! We found ${totalHits} images."`
            )
            gallery.refresh();
            window.addEventListener('scroll', onScroll)

            if (!hits.length) {
                Notiflix.Notify.warning(
                    "We're sorry, but you've reached the end of search results."
                )
            }
            }

    
}

// async function onLoadMore() {
//     const {hits, totalHits} = await fetchImages(searchQuery)
//         addToGallery(hits)
//         // console.log(searchQuery)
//         Notiflix.Notify.success(
//             `"Hooray! We found ${totalHits} images."`
//         )
//         gallery.refresh()
//         if (!hits.length) {
//             Notiflix.Notify.warning(
//                 "We're sorry, but you've reached the end of search results."
//                 )
//         }
        
// }

function addToGallery(hits)  {
    refs.galleryList.insertAdjacentHTML('beforeend', createImageGallery(hits))
}

function clearGalleryList() {
    refs.galleryList.innerHTML = ''
}

function createImageGallery(array) {
    return array.reduce((acc, el) => acc + createImageCard(el), '')
}

function createImageCard({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    return `
        <div class="photo-card">
            <a class = "gallery__item" href = "${largeImageURL}">
                <img 
                class = "gallery__image"
                src = "${webformatURL}" 
                data-source = "${largeImageURL}" 
                alt = "${tags}" loading="lazy"  />
                </a>
            <div class= "info" style="display: flex; align-items: center;">
                <p class="info-item">
                    <b class="info-text"> Likes <span class="info-span">${likes}</span></b>
                </p>
                <p class="info-item">
                    <b class="info-text"> Views <span class="info-span"> ${views}</span></b>
                </p>
                <p class="info-item">
                    <b class="info-text"> Comments <span class="info-span">${comments}</span></b>
                </p>
                <p class="info-item">
                    <b class="info-text"> Downloads <span class="info-span">${downloads}</span></b>
                </p>
            </div>
            
        </div>
    `
}