/*
const {create, Client} = require('@open-wa/wa-automate');
const cron = require('node-cron');
const fs = require('fs');
const db = require('../data/initialize_database');

let clientInstance; // Instancia única de WhatsApp Web

// Carga los contactos desde el archivo contacts.json
const contactsData = fs.readFileSync('./data/contacts.json');
const contacts = JSON.parse(contactsData).contacts;

// Almacena los mensajes programados por los usuarios
const scheduledMessages = [];

function saveScheduledMessage(hour, minutes, number, message,status) {
    const insertQuery = `INSERT INTO scheduled_messages (hour, minutes, number, message, status)
                         VALUES (?, ?, ?, ?, ?)`;
    db.run(insertQuery, [hour, minutes, number, message], (err) => {
        if (err) {
            console.error('Error al guardar el mensaje programado:', err.message);
        } else {
            console.log('Mensaje programado guardado correctamente.');
        }
    })

    db.close();
}

// Método para programar un mensaje
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

// Crea una instancia de WhatsApp Web
const start = async () => {
    clientInstance = await create({sessionId: 'my-session'});
    console.log('WhatsApp está listo.');

    // Método para recibir mensajes
    await clientInstance.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        // Evita que los mensajes con /programar caigan en los primeros if
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
                    saveScheduledMessage(hour, minutes, number, userMessage,'programado');
                    const responseSchedule = `Mensaje programado para las:\n*Hora:* ${time}\n*Mensaje*: ${userMessage}\n*Número a enviar:* ${number}`
                    await clientInstance.sendText(message.from, responseSchedule);
                } else {
                    await clientInstance.sendText(message.from, 'Formato de tiempo incorrecto. Utiliza HH:mm.');
                }
            } else {
                await clientInstance.sendText(message.from, 'Formato incorrecto. Debe ser: /programar [HH:mm] [numero] [mensaje]');
            }
        } else if (lowerCaseMessage.includes('hola')) {
            await clientInstance.sendText(message.from, '¡Hola! ¿En qué puedo ayudarte? 😊');
            await clientInstance.sendText(message.from, 'Soy un asistente virtual de WhatsApp. 😊\n' + 'Estoy aquí para ayudarte con las siguientes funciones:\n\n' + '📋 /comandos - Mostrar esta lista de comandos disponibles.\n' + '📜 /ver_programados - Ver mensajes programados.\n' + '📅 /programar [HH:mm] [numero] [mensaje] - Programar un mensaje.\n\n' + '¡Si tienes alguna pregunta o necesitas ayuda, no dudes en preguntar! 👍');

        } else if (lowerCaseMessage.includes('adiós')) {
            await clientInstance.sendText(message.from, 'Adiós. ¡Que tengas un buen día! 👋');
        } else if (lowerCaseMessage.includes('comandos')) {
            // Responde con la lista de comandos disponibles
            const commandList = 'Responde con la lista de comandos disponible | Comandos Disponibles:\n' + '📋 /comandos - Mostrar esta lista\n' + '📜 /ver_programados - Ver mensajes programados\n' + '📅 /programar [HH:mm] [505numero] [mensaje] - Programar un mensaje\n';

            await clientInstance.sendText(message.from, commandList);
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
    });

    // Programa el envío de mensajes a los contactos según la hora especificada
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        let messageToSend = '';

        for (const contact of contacts) {
            if (contact.hourToSend === now.getHours() && now.getMinutes() === contact.minuteToSend) {
                // Mensaje personalizado según la hora
                messageToSend = '¡Buenos días!';
                if (now.getHours() >= 12 && now.getHours() < 18) {
                    messageToSend = '¡Buenas tardes!';
                } else if (now.getHours() >= 18) {
                    messageToSend = '¡Buenas noches!';
                }

                await clientInstance.sendText(`${contact.number}@c.us`, `${messageToSend} ${contact.name}, este es un mensaje programado.`);
            }
        }
    });
};

module.exports = {
    start, getClient: () => clientInstance, // Exporta la instancia de WhatsApp Web
};
*/



const { startWhatsApp, getClient } = require('./whatsapp');
const { handleCommands } = require('./commands');
const { scheduleMessage } = require('./scheduler');

// Inicializa WhatsApp
startWhatsApp();

// Maneja los comandos y respuestas personalizadas
handleCommands();

// Programa mensajes según la configuración
//scheduleMessage();
