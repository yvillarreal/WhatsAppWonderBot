const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const {scheduleMessage, showNotification} = require("./schedule_web")
const {getClient} = require("./module/whatsapp");

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

app.post('/send', async (req, res) => {
    const {from, to, hour, minutes, date, message} = req.body;

    const result = scheduleMessage(Number(from), Number(to), Number(hour), Number(minutes), new Date(date), message);

    const successMessage = `Mensaje programado a ${to}: ${message}`;
    showNotification(successMessage, 'Éxito');

    // Limpiar los campos del formulario después de enviar
    req.body.from = '';
    req.body.to = '';
    req.body.hour = '';
    req.body.minutes = '';
    req.body.date = '';
    req.body.message = '';
    res.redirect('/');
});

app.post('/search-contact', async (req, res) => {
    const searchTerm = req.body.searchTerm;
    // Llamar al método searchContactByName con el término de búsqueda
    const foundContacts = await searchContactByName(searchTerm);
    res.json(foundContacts); // Devolver los resultados como respuesta JSON
});

const searchContactByName = async (name) => {
    try {
        const client = getClient();
        const tt = getClient().getMe();
        //const contacts = await client.getAllContacts();
        /*return contacts.filter((contact) =>
            contact.name && contact.name.toLowerCase().includes(name.toLowerCase())
        );*/
    } catch (error) {
        console.error('Error al buscar contactos:', error);
        return [];
    }
};



module.exports = app;
