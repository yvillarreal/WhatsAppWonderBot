const cron = require('node-cron');
const {getClient} = require('./module/whatsapp');

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

module.exports = {validateFields, scheduleMessage};
