'use strict';
const axios = require('axios').default;
require('dotenv').config();




let cityCache = require('./Cache.js');


async function handleRequest(url) {

    try {
        let response = await axios.get(url);
        return response;
    } catch (e) {
        throw new Error(e);
    }
}

class Forecast {
    constructor(obj) {
        this.date = obj.datetime;
        this.description = 'Low of ' + obj.low_temp + ', High of ' + obj.high_temp + ' with ' + obj.weather.description.toLowerCase();
        this.icon = obj.weather.icon;
    }
}

async function gatherWeather(request, response) {

    let { lat, lon, searchQuery } = request.query;
    if (!lat || !lon || !searchQuery) {
        throw new Error('Please send lat, lon, and search query string.');
    }

    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I`;

    if (cityCache[searchQuery] && (Date.now() - cityCache[searchQuery].timestamp < 50000)) {
        console.log('Data found in cache', cityCache);
        response.send(cityCache[searchQuery]);
        console.log(Date.now());
    } else {
        try {
            let res = await handleRequest(url);

            if (res) {
                let forecastData = res.data.data.map(forecast => new Forecast(forecast));
                cityCache[searchQuery] = {};
                cityCache[searchQuery].timestamp = Date.now();
                cityCache[searchQuery] = forecastData;
                response.send(forecastData);
            } else {
                response.status(404).send('City not found');
            }
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = gatherWeather;
