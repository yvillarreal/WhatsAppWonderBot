const {getClient} = require('./whatsapp');
const cron = require("node-cron");
const {create} = require("@open-wa/wa-automate");
const data  = require("./database");

const scheduledMessages = [];

function scheduleMessage(number, hour, minutes, message) {
    scheduledMessages.push({number, hour, minutes, message});
    // Configura la tarea cron para enviar el mensaje en la hora y minutos especificados
    const cronExpression = `${minutes} ${hour} * * *`;
    const task = cron.schedule(cronExpression, async () => {
        await clientInstance.sendText(`${number}@c.us`, message);
        // Elimina el mensaje programado de la lista una vez que se envía
        const index = scheduledMessages.findIndex((msg) => msg.number === number && msg.hour === hour && msg.minutes === minutes && msg.message === message);
        if (index !== -1) {
            scheduledMessages.splice(index, 1);
        }
        // Detiene la tarea cron
        task.destroy();
    });
}


const startSchedule = async () => {
    clientInstance = await create({sessionId: 'my-session'});
    console.log('WhatsApp está listo.');

    // Método para recibir mensajes
    await clientInstance.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage.startsWith('/programar')) {
            // Ejemplo de formato esperado: /programar 14:30 1234567890 Hola, este es un mensaje programado
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

                    scheduleMessage(number, hour, minutes, userMessage);
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
            if (scheduledMessages.length === 0) {
                await clientInstance.sendText(message.from, 'No hay mensajes programados. 😔');
            } else {
                const scheduledMessageList = scheduledMessages.map((msg) => `*Hora:* ${msg.hour}:${msg.minutes}\n*Mensaje*: ${msg.message}\n*Número a enviar:* ${msg.number}\n|===============================|`);
                const response = `*_Mensajes Programados:_*\n${scheduledMessageList.join('\n')}`;
                await clientInstance.sendText(message.from, response);
            }
        }

    })
}


module.exports = {
    startSchedule
};