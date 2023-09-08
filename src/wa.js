const {create, Client} = require('@open-wa/wa-automate');
const cron = require('node-cron');
const fs = require('fs');

let clientInstance; // Instancia única de WhatsApp Web

// Cargar números desde el archivo numbers.json
//const numbersData = fs.readFileSync('utils/numbers.json');
const numbersData = fs.readFileSync('numbers.json');
const numbers = JSON.parse(numbersData).numbers;

// Crea una instancia de WhatsApp Web
const start = async () => {
    clientInstance = await create({sessionId: 'my-session'});
    console.log('WhatsApp está listo.');

    // Método para recibir mensajes
    await clientInstance.onMessage(async (message) => {
        if (message.body.toLowerCase() === 'hola') {
            await clientInstance.sendText(message.from, 'Hola, ¿en qué puedo ayudarte?');
        }
    });
};

module.exports = {
    start, getClient: () => clientInstance, // Exporta la instancia de WhatsApp Web
};
