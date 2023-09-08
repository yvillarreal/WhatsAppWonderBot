const cron = require('node-cron');
const {getClient} = require('./wa');

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

    //const cronExpression = `${minutes} ${hour} ${date.getDate()} ${date.getMonth() + 1} *`;
    const cronExpression = `${minutes} ${hour} ${date.getDate() + 1} ${date.getMonth() + 1} *`;

    cron.schedule(cronExpression, async () => {
        try {
            // Tu lógica para enviar el mensaje
            await client.sendText(`${to}@c.us`, message);
            await client.sendText(`${from}@c.us`, `El mensaja enviado al número (${to}: con el siguiente mensaje: ${message}) ha sido enviado exitosamente.`);
        } catch (error) {
            console.error('Error al enviar el mensaje programado:', error);
        }
    });
    return `Mensaje programado para enviar de ${from} a ${to} a las ${hour}:${minutes} el ${date.toDateString()}.`;
}

module.exports = {validateFields, scheduleMessage};
