const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {getClient} = require('./wa');
const notifier = require('node-notifier');
const {validateFields, scheduleMessage} = require('./schedule'); // Importa las funciones

const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});


app.get('/schedule', (req, res) => {
    res.sendFile(__dirname + '/schedule.html');
});


app.post('/schedule', async (req, res) => {
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


// Después de enviar el mensaje
app.post('/send', async (req, res) => {
    const {number, message} = req.body;

    // Validar que los campos no estén vacíos
    if (!number || !message) {
        const errorMessage = 'Ambos campos son requeridos.';
        res.send(errorMessage);
        showNotification(errorMessage, 'Error');
        return;
    }

    // Enviar el mensaje utilizando la instancia de WhatsApp Web
    const client = getClient();
    await client.sendText(`${number}@c.us`, message);

    const successMessage = `Mensaje enviado a ${number}: ${message}`;
    showNotification(successMessage, 'Éxito');

    // Limpiar los campos del formulario después de enviar
    req.body.number = '';
    req.body.message = '';

    // Renderizar nuevamente el formulario con los campos limpios
    res.redirect('/');
});


function showNotification(message, title) {
    notifier.notify({
        title: title, message: message,
    });
}


module.exports = app;
