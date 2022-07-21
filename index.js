'use strict';

require('dotenv').config();

const express = require('express');

const cors = require('cors');
const data = require('./data/weather.json');

const app = express(); // returns an object, with methods designed to handle Requests.
const PORT = process.env.PORT;

app.use(cors());

class Forecast {
    constructor(obj) {
        this.date = obj.datetime;
        this.description = 'low of ' + obj.low_temp + ', high of ' + obj.high_temp + ' with ' + obj.weather.description.toLowerCase();
    }
}


app.get('/weather', (request, response) => {

    let { lat, lon, searchQuery } = request.query;

    if (!lat || !lon || !searchQuery) {
        throw new Error('Please send lat, lon, and search query string.');
    }

    let city = data.find(city => {
        return city.city_name.toLowerCase() === searchQuery.toLowerCase();
    });

    if (city) {
        let forecastData = city.data.map(forecast => new Forecast(forecast));
        response.send(forecastData);
    } else {
        response.status(404).send('City not found');
    }
}
);

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
