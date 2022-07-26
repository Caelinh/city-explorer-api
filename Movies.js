const axios = require('axios').default;
require('dotenv').config();

let movieCache = require('./Cache');

async function handleRequest(url) {

    try {
        let response = await axios.get(url);
        return response;
    } catch (e) {
        throw new Error(e);
    }
}

class Movies {
    constructor(obj) {
        this.title = obj.title;
        this.releaseDate = obj.release_date;
        this.poster = obj.poster_path;
        this.overview = obj.overview;
    }
}



const gatherMovies = async (request, response) => {
    let { searchQuery } = request.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&adult=false`;
    if (movieCache[searchQuery]&& (Date.now() - movieCache[searchQuery].timestamp < 50000)) {
        console.log('Data found in cache', movieCache);
        response.send(movieCache[searchQuery]);
    } else {
        try {
            let res = await handleRequest(url);
            let movieData = res.data.results.map(movie => new Movies(movie));
            movieCache[searchQuery] = {};
            movieCache[searchQuery].timestamp = Date.now();
            movieCache[searchQuery] = movieData;
            response.send(movieData);

        } catch (e) {
            console.log(e);
        }
    }
};


module.exports = gatherMovies;
