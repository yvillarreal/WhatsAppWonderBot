const express = require('express');
const bodyParser = require('body-parser');
const {getClient} = require('./wa');
const notifier = require('node-notifier');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html');
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

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});



// form.js
module.exports = app;
