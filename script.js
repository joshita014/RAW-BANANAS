const movieSearchBox = document.querySelector('#movie-search-box'); //Input box
const searchList = document.querySelector('#search-list'); // Autocomplete box
const resultGrid = document.querySelector('#result-grid'); // Result container

// Set default data to localstorage
if(!localStorage.getItem('favMovies')){
    let favMovies = [];
    localStorage.setItem('favMovies',JSON.stringify(favMovies));
}

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
   // Check if everything is Okay
    if(data.Response == "True") displayMovieList(data.Search);
}

//Find movies as you type any character
const findMovies = () => {
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// Show the matched movies in the autocomplete box
const displayMovieList = (movies) => {
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}


const loadMovieDetails = () => {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            localStorage.setItem('movieID',movie.dataset.id);
             window.location.href = `${window.location.origin}/result/resultPage.html`; //Redirect to a new page
        });
    });
}

// EventListners
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});
movieSearchBox.addEventListener('keyup', findMovies);
movieSearchBox.addEventListener('click', findMovies);