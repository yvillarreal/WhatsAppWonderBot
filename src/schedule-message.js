const cron = require('node-cron');
const notifier = require("node-notifier");
const {getClient} = require("./module/whatsapp");
const moment = require('moment');
const data = require("./module/database");

function scheduleMessage(from, to, hour, minutes, date, message) {
    const isValid = validateFields(from, to, hour, minutes, date);
    if (!isValid) {
        return 'Los campos del formulario no son válidos.';
    }

    const client = getClient();

    // Combina la fecha, hora y minutos en un solo formato de cadena
    const dateTimeString = `${date} ${hour}:${minutes}`;
    const dateTime = moment(dateTimeString, 'DD-MM-YYYY HH:mm');

    const cronExpression = `${minutes} ${hour} ${date.getDate() + 1} ${date.getMonth() + 1} *`;

    data.saveScheduledMessage(dateTime, to, client._hostAccountNumber, message, 'programado', "daily")
        .then(async id => {
            cron.schedule(cronExpression, async () => {
                try {
                    await client.sendText(`${to}@c.us`, message);
                    await client.sendText(`${from}@c.us`, `✅ *Mensaje Programado Enviado Exitosamente* ✅\n\nNúmero Destino: *${to}*\nMensaje: *${message}* 🚀`);
                } catch (error) {
                    console.error('Error al enviar el mensaje programado:', error);
                }
            });
            console.log(`Mensaje programado guardado con ID: ${id}`);
        })
        .catch((error) => {
            console.error('Error al guardar el mensaje programado:', error);
        });

    return `Mensaje programado para enviar de ${from} a ${to} a las ${hour}:${minutes} el ${date.toDateString()}.`;
}

function showNotification(message, title) {
    notifier.notify({
        title: title, message: message,
    });
}

function validateFields(from, to, hour, minutes, date) {
    return !(!Number.isInteger(to) || !Number.isInteger(hour) || !Number.isInteger(minutes) || isNaN(Date.parse(date)));
}

module.exports = {scheduleMessage, showNotification};


