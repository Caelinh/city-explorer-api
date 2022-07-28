'use strict';

require('dotenv').config();


const express = require('express');

const cors = require('cors');


const app = express(); // returns an object, with methods designed to handle Requests.
const PORT = process.env.PORT;

app.use(cors());


const gatherWeather = require('./Weather');
const gatherMovies = require('./Movies');

app.get('/weather', gatherWeather);

app.get('/movies', gatherMovies);



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
