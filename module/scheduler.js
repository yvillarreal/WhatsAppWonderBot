const cron = require("node-cron");
const data = require("./database");
const moment = require('moment'); // Importa la librería 'moment' para el manejo de fechas


function scheduler(clientInstance) {

    // Método para recibir mensajes
    clientInstance.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage.startsWith('/programar')) {
            const commandParts = lowerCaseMessage.split(' ');

            if (commandParts.length >= 5) {
                const time = commandParts[1]; // HH:mm
                const date = commandParts[2]; // dd-MM-yyyy
                const number_to = commandParts[3];
                const number_from = clientInstance._hostAccountNumber;
                const userMessage = commandParts.slice(4).join(' ');

                // Valida el formato de tiempo (HH:mm) y fecha (dd-MM-yyyy)
                const timeValid = moment(time, 'HH:mm', true).isValid();
                const dateValid = moment(date, 'DD-MM-YYYY', true).isValid();

                if (timeValid && dateValid) {
                    const dateTime = moment(`${date} ${time}`, 'DD-MM-YYYY HH:mm');

                    data.saveScheduledMessage(dateTime, number_to, number_from, userMessage, 'programado')
                        .then(async id => {
                            console.log(`Mensaje programado guardado con ID: ${id}`);
                            scheduleMessage(clientInstance, number_to, number_from, dateTime, userMessage, id);
                            const responseSchedule = `Mensaje programado para el ${dateTime.format('DD-MM-YYYY [a las] HH:mm')}:\n*Mensaje*: ${userMessage}\n*Número a enviar:* ${number_to}`;
                            await clientInstance.sendText(message.from, responseSchedule);
                        }).catch((error) => {
                        console.error('Error al guardar el mensaje programado:', error);
                    });

                } else {
                    await clientInstance.sendText(message.from, 'Formato de hora o fecha incorrecto. Utiliza HH:mm y dd-MM-yyyy.');
                }
            } else {
                await clientInstance.sendText(message.from, 'Formato incorrecto. Debe ser: /programar [HH:mm] [dd-MM-yyyy] [numero] [mensaje]');
            }
        } else if (lowerCaseMessage.includes('/ver_programados')) {

            data.loadPendingMessages((err, messages) => {
                if (err) {
                    console.error('Error al cargar mensajes programados:', err.message);
                    return;
                }

                if (messages.length === 0) {
                    // No hay mensajes programados
                    clientInstance.sendText(message.from, 'No hay mensajes programados. 😔');
                } else {
                    // Mostrar mensajes programados
                    const scheduledMessageList = messages.map((msg) => `*ID:* ${msg.id}\n*Hora:* ${msg.hour}:${msg.minutes}\n*Mensaje*: ${msg.message}\n*Número a enviar:* ${msg.number_to}\n*Estado:* ${msg.status}\n|===============================|`);
                    const response = `*_Mensajes Programados:(${scheduledMessageList.length})_*\n${scheduledMessageList.join('\n')}`;
                    clientInstance.sendText(message.from, response);
                }
            });

        }
    });
}


function scheduleMessage(clientInstance, number_to, number_from, dateTime, message, id) {
    // Configura la tarea cron para enviar el mensaje en la hora y minutos especificados
    const cronExpression = `${dateTime.format('m')} ${dateTime.format('h')} * * *`;
    const task = cron.schedule(cronExpression, async () => {
        await clientInstance.sendText(`${number_to}@c.us`, message);
        await clientInstance.sendText(`${number_from}@c.us`, `El mensaje al número: ${number_from}, programado para las ${hour}:${minutes}. Ha sido enviado con exito.`)
        data.updateScheduleMessage(id);
        task.destroy();
    });
}


module.exports = {scheduler};