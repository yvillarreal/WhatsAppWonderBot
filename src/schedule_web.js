const cron = require('node-cron');
const notifier = require("node-notifier");
const {getClient} = require("./module/whatsapp");
const moment = require('moment');
const data = require("./module/database");

function schedule_web(from, to, hour, minutes, date, message) {
    const isValid = validateFields(from, to, hour, minutes, date);
    if (!isValid) {
        return 'Los campos del formulario no son válidos.';
    }

    const client = getClient();
    from = '505123456789';

    // Combina la fecha, hora y minutos en un solo formato de cadena
    const dateTimeString = `${date} ${hour}:${minutes}`;
    const dateTime = moment(dateTimeString, 'DD-MM-YYYY HH:mm');

    const cronExpression = `${minutes} ${hour} ${date.getDate() + 1} ${date.getMonth() + 1} *`;

    data.saveScheduledMessage(dateTime, to, client._hostAccountNumber, message, 'programado', '', 'web')
        .then(async id => {
            console.log(`${to.toString()}@c.us`)
            console.log(`${from.toString()}@c.us`)
            cron.schedule(cronExpression, async () => {
                try {
                    await client.sendText(`${to.toString()}@c.us`, message);
                    await client.sendText(`${from.toString()}@c.us`, `✅ *Mensaje Programado Enviado Exitosamente* ✅\n\nNúmero Destino: *${to}*\nMensaje: *${message}* \n\n🚀`);
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

module.exports = {scheduleMessage: schedule_web, showNotification};


