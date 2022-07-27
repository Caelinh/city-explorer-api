'use strict';
const axios = require('axios').default;
require('dotenv').config();






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

}

module.exports = gatherWeather;
