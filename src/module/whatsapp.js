const {create, Client} = require('@open-wa/wa-automate');
const {handleCommands} = require('./commands');
const {scheduler} = require('./scheduler');
const {getMediaFromHost} = require('./media')
const fs = require('fs');

// Carga el archivo de palabras clave y mensajes de bienvenida
const welcomeMessagesData = fs.readFileSync('./data/welcome_messages.json');
const welcomeMessages = JSON.parse(welcomeMessagesData);

let clientInstance;

async function startWhatsApp() {
    clientInstance = await create({sessionId: 'my-session'});
    console.log("Cargando módulo de comandos.")
    handleCommands(clientInstance);
    console.log("Cargando módulo de scheduler.")
    scheduler(clientInstance);
    console.log("Cargando recursos multimedia.")
    getMediaFromHost(clientInstance, 'media');
    console.log('🚀 WhatsAppWonderBot está listo. 🚀');

    // Configura un mensaje de bienvenida
    await clientInstance.onStateChanged((state) => {
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') {
            console.log('Bot necesita ser reiniciado.');
        }
    });

    clientInstance.onMessage(async (message) => {
        if (!message.isGroupMsg) {
            const lowerCaseMessage = message.body.toLowerCase();
            const userNumber = message.from;

            // Buscar palabras clave en el mensaje y enviar mensajes de bienvenida
            for (const keyword in welcomeMessages.keywords) {
                if (lowerCaseMessage.includes(keyword)) {
                    const welcomeMessage = welcomeMessages.keywords[keyword];
                    await clientInstance.sendText(message.from, welcomeMessage);
                    break; // Detener la búsqueda después de encontrar la primera palabra clave
                }
            }

            if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('comandos')) {
                // Mensaje de bienvenida con comandos disponibles
                const commandList = 'Comandos Disponibles:\n' + '📋 /comandos - Mostrar esta lista de comandos disponibles.\n' + '📜 /ver_programados - Ver mensajes programados.\n' + '📅 /programar [frecuencia: daily,weekly] [HH:mm] [dd-MM-yyyy] [numero] [mensaje] - Programar un mensaje.\n\n*Ejemplo:*\n/programar daily 13:45 05-12-2023 505XXXXXX Hola soy un mensaje :)\n\n' + '✏️ /editar_programado [ID] [HH:mm] [mm] - Edita un mensaje programado.\n\n*Ejemplo:* /editar 1 14:30 Nuevo mensaje\n\n' + '❌ /eliminar_programado [ID] - Elimina un mensaje programado por ID.\n\n*Ejemplo:* /eliminar_programado 1';

                const welcomeMessage = `¡Hola! Soy un asistente virtual de WhatsApp. 😊\nEstoy aquí para ayudarte con las siguientes funciones:\n\n${commandList}`;
                await clientInstance.sendText(userNumber, welcomeMessage);
            }
        }
    });
}


function getClient() {
    return clientInstance;
}

module.exports = {
    startWhatsApp, getClient
};
