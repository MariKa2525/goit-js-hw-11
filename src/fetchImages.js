const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '32297274-6805a2e4fdba4765ca35c3823';
const perPage = 40
let page = 1

export default async function fetchImages(searchQuery, isNewSearch) {
    page = isNewSearch? 1 : page
    const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    const  data = await response.data
    page += 1
    return data;
}



