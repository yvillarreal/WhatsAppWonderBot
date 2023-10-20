const express = require('express');
const appIndex = express();
const bodyParser = require('body-parser');
const path = require('path');
const notifier = require("node-notifier");

appIndex.use(bodyParser.urlencoded({extended: true}));

appIndex.get('/', (req, res) => {
    res.sendFile('welcome.html', {root: path.join(__dirname, '..', 'public')});
});

appIndex.get('/schedule-message', (req, res) => {
    res.sendFile('schedule-message.html', {root: path.join(__dirname, '..', 'public')});
});

appIndex.get('/about', (req, res) => {
    res.sendFile('about.html', {root: path.join(__dirname, '..', 'public')});
});

module.exports = appIndex;
