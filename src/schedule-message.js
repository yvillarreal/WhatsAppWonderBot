const cron = require('node-cron');
const bodyParser = require('body-parser');
const {getClient} = require('./module/whatsapp');
const notifier = require("node-notifier");
const express = require("express");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// Función para validar los campos del formulario
function validateFields(from, to, hour, minutes, date) {
    return !(!Number.isInteger(from) || !Number.isInteger(to) || !Number.isInteger(hour) || !Number.isInteger(minutes) || isNaN(Date.parse(date)));
}

// Función para programar un mensaje
function scheduleMessage(from, to, hour, minutes, date, message) {
    const isValid = validateFields(from, to, hour, minutes, date);
    if (!isValid) {
        return 'Los campos del formulario no son válidos.';
    }

    const client = getClient();

    const cronExpression = `${minutes} ${hour} ${date.getDate() + 1} ${date.getMonth() + 1} *`;

    cron.schedule(cronExpression, async () => {
        try {
            await client.sendText(`${to}@c.us`, message);
            await client.sendText(`${from}@c.us`, `✅ *Mensaje Programado Enviado Exitosamente* ✅\n\nNúmero Destino: *${to}*\nMensaje: *${message}* 🚀`);
        } catch (error) {
            console.error('Error al enviar el mensaje programado:', error);
        }
    });
    return `Mensaje programado para enviar de ${from} a ${to} a las ${hour}:${minutes} el ${date.toDateString()}.`;
}

function showNotification(message, title) {
    notifier.notify({
        title: title, message: message,
    });
}

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


module.exports = {validateFields, scheduleMessage};
