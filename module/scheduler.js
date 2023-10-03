const cron = require("node-cron");
const data = require("./database");

const scheduledMessagesList = [];

function startSchedule(clientInstance) {

    // Método para recibir mensajes
    clientInstance.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage.startsWith('/programar')) {
            const commandParts = lowerCaseMessage.split(' ');

            if (commandParts.length >= 4) {
                const time = commandParts[1]; // HH:mm
                const number = commandParts[2];
                const userMessage = commandParts.slice(3).join(' ');

                // Valida el formato de tiempo (HH:mm)
                const timeParts = time.split(':');
                if (timeParts.length === 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
                    const hour = parseInt(timeParts[0]);
                    const minutes = parseInt(timeParts[1]);

                    scheduleMessage(clientInstance, number, hour, minutes, userMessage);
                    data.saveScheduledMessage(hour, minutes, number, userMessage, 'programado');
                    const responseSchedule = `Mensaje programado para las:\n*Hora:* ${time}\n*Mensaje*: ${userMessage}\n*Número a enviar:* ${number}`
                    await clientInstance.sendText(message.from, responseSchedule);
                } else {
                    await clientInstance.sendText(message.from, 'Formato de tiempo incorrecto. Utiliza HH:mm.');
                }
            } else {
                await clientInstance.sendText(message.from, 'Formato incorrecto. Debe ser: /programar [HH:mm] [numero] [mensaje]');
            }
        } else if (lowerCaseMessage.includes('/ver_programados')) {
            // Mostrar mensajes programados
            if (scheduledMessagesList.length === 0) {
                await clientInstance.sendText(message.from, 'No hay mensajes programados. 😔');
            } else {
                const scheduledMessageList = scheduledMessagesList.map((msg) => `*Hora:* ${msg.hour}:${msg.minutes}\n*Mensaje*: ${msg.message}\n*Número a enviar:* ${msg.number}\n|===============================|`);
                const response = `*_Mensajes Programados:_*\n${scheduledMessageList.join('\n')}`;
                await clientInstance.sendText(message.from, response);
            }
        }
    });
}


function scheduleMessage(clientInstance, number, hour, minutes, message) {
    scheduledMessagesList.push({number, hour, minutes, message});
    // Configura la tarea cron para enviar el mensaje en la hora y minutos especificados
    const cronExpression = `${minutes} ${hour} * * *`;
    const task = cron.schedule(cronExpression, async () => {
        await clientInstance.sendText(`${number}@c.us`, message);
        // Elimina el mensaje programado de la lista una vez que se envía
        const index = scheduledMessagesList.findIndex((msg) =>
            msg.number === number &&
            msg.hour === hour &&
            msg.minutes === minutes &&
            msg.message === message);
        if (index !== -1) {
            scheduledMessagesList.splice(index, 1);
        }
        // Detiene la tarea cron
        task.destroy();
    });
}


module.exports = {
    startSchedule,
    scheduleMessage
};