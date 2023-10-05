const cron = require("node-cron");
const moment = require('moment');
const data = require("./database");

async function scheduler(clientInstance) {
    clientInstance.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage.startsWith('/programar')) {
            const commandParts = lowerCaseMessage.split(' ');

            if (commandParts.length >= 6) {
                const frequency = commandParts[1]; // Frecuencia (e.g., "daily", "weekly")
                const time = commandParts[2]; // HH:mm
                const date = commandParts[3]; // dd-MM-yyyy
                const numberTo = commandParts[4];
                const userMessage = commandParts.slice(5).join(' ');

                const isValidFrequency = validateFrequency(frequency);
                const isValidTime = moment(time, 'HH:mm', true).isValid();
                const isValidDate = moment(date, 'DD-MM-YYYY', true).isValid();

                if (isValidFrequency && isValidTime && isValidDate) {
                    const dateTime = moment(`${date} ${time}`, 'DD-MM-YYYY HH:mm');
                    const now = moment();

                    /*if (dateTime.isBefore(now)) {
                        console.log('Intenta programar un mensaje en una fecha/hora anterior.');
                        await clientInstance.sendText(message.from, 'Intenta programar un mensaje en una fecha/hora anterior.');
                        return;
                    }*/

                    const frequencyExpression = getFrequencyExpression(frequency);
                    const cronExpression = `${dateTime.format('m')} ${dateTime.format('h')} ${frequencyExpression} * *`;

                    data.saveScheduledMessage(dateTime, numberTo, clientInstance._hostAccountNumber, userMessage, 'programado', frequency)
                        .then(async id => {
                            const responseSchedule = `Mensaje programado para el ${dateTime.format('DD-MM-YYYY [a las] HH:mm')}:\n*Mensaje*: ${userMessage}\n*Número a enviar:* ${numberTo}\n*Frecuencia:* ${frequency}`;
                            scheduleMessage(clientInstance, numberTo, userMessage, cronExpression);
                            await clientInstance.sendText(message.from, responseSchedule);
                            console.log(`Mensaje programado guardado con ID: ${id}`);
                        })
                        .catch((error) => {
                            console.error('Error al guardar el mensaje programado:', error);
                        });
                } else {
                    await clientInstance.sendText(message.from, 'Formato de frecuencia, hora o fecha incorrecto. Utiliza una frecuencia válida (daily/weekly), HH:mm y dd-MM-yyyy.');
                }
            } else {
                await clientInstance.sendText(message.from, 'Formato incorrecto. Debe ser: /programar [frecuencia] [HH:mm] [dd-MM-yyyy] [numero] [mensaje]');
            }
        } else if (lowerCaseMessage.includes('/ver_programados')) {
            loadScheduledMessages(clientInstance, message);
        }
    });
}

function validateFrequency(frequency) {
    return ['daily', 'weekly'].includes(frequency.toLowerCase());
}

function getFrequencyExpression(frequency) {
    switch (frequency.toLowerCase()) {
        case 'daily':
            return '*';
        case 'weekly':
            return '0';
        default:
            return '*';
    }
}

function scheduleMessage(clientInstance, numberTo, message, cronExpression) {
    cron.schedule(cronExpression, async () => {
        try {
            await clientInstance.sendText(`${numberTo}@c.us`, message);
        } catch (error) {
            console.error('Error al enviar el mensaje programado:', error);
        }
    });
}

async function loadScheduledMessages(clientInstance, message) {
    data.loadPendingMessages(async (err, messages) => {
        if (err) {
            console.error('Error al cargar mensajes programados:', err.message);
            return;
        }

        if (messages.length === 0) {
            clientInstance.sendText(message.from, 'No hay mensajes programados. 😔');
        } else {
            const formattedMessages = messages.map((msg) => {
                return `*ID:* ${msg.id}\n*Hora:* ${msg.hour}:${msg.minutes}\n*Mensaje*: ${msg.message}\n*Número a enviar:* ${msg.number_to}\n*Frecuencia:* ${msg.frequency}\n*Estado:* ${msg.status}\n|===============================|`;
            });

            const response = `*_Mensajes Programados (${formattedMessages.length}):_*\n${formattedMessages.join('\n')}`;
            clientInstance.sendText(message.from, response);
        }
    });
}

module.exports = {scheduler};
