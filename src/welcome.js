const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile('welcome.html', {root: path.join(__dirname, '..', 'public')});
});

app.get('/schedule-message', (req, res) => {
    res.sendFile('schedule-message.html', {root: path.join(__dirname, '..', 'public')});
});

app.get('/about', (req, res) => {
    res.sendFile('about.html', {root: path.join(__dirname, '..', 'public')});
});

module.exports = app;
