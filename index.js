'use strict';

require('dotenv').config();
const axios = require('axios').default;

const express = require('express');

const cors = require('cors');
const { response } = require('express');

const app = express(); // returns an object, with methods designed to handle Requests.
const PORT = process.env.PORT;

app.use(cors());

class Forecast {
    constructor(obj) {
        this.date = obj.datetime;
        this.description = 'Low of ' + obj.low_temp + ', High of ' + obj.high_temp + ' with ' + obj.weather.description.toLowerCase();
        this.icon = obj.weather.icon;
    }
}


async function handleRequest(url) {

    try {
        let response = await axios.get(url);
        return response;
    } catch (e) {
        throw new Error(e);
    }
}

app.get('/weather', async (request, response) => {

    let { lat, lon, searchQuery } = request.query;
    if (!lat || !lon || !searchQuery) {
        throw new Error('Please send lat, lon, and search query string.');
    }

    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I`;

    try {
        let res = await handleRequest(url);
        if (res) {
            let forecastData = res.data.data.map(forecast => new Forecast(forecast));
            response.send(forecastData);
        } else {
            response.status(404).send('City not found');
        }
    } catch (e) {
        console.log(e);
    }

});

class Movies {
    constructor(obj) {
        this.title = obj.title;
        this.releaseDate = obj.release_date;
        this.poster = obj.poster_path;
        this.overview = obj.overview;
    }
}

app.get('/movies', async (request, response) => {
    let { searchQuery } = request.query;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&adult=false`;
    try {
        let res = await handleRequest(url);
        let movieData = res.data.results.map(movie => new Movies(movie));
        response.send(movieData);

    } catch (e) {
        console.log(e);
    }
});



// error handlers take a special 1st parameter, that will be any error thrown from another route handler
app.use('*', (error, request, response,) => {
    response.status(500).send(error);
});

// put error handlers down here
app.use('*', (request, response) => {
    response.status(404).send('Route Not found :(');
});

// opens up the server for requests
app.listen(PORT, () => {
    console.log('Server is running on port : ' + PORT);
});
