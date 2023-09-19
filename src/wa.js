const {create, Client} = require('@open-wa/wa-automate');

let clientInstance; // Instancia única de WhatsApp Web

// Crea una instancia de WhatsApp Web
const start = async () => {
    clientInstance = await create({sessionId: 'my-session'});
    console.log('WhatsApp está listo.');

    // Método para recibir mensajes
    await clientInstance.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage.includes('hola')) {
            await clientInstance.sendText(message.from, '¡Hola! ¿En qué puedo ayudarte? 😊');
        } else if (lowerCaseMessage.includes('adiós')) {
            await clientInstance.sendText(message.from, 'Adiós. ¡Que tengas un buen día! 👋');
        }
    });
};

module.exports = {
    start, getClient: () => clientInstance, // Exporta la instancia de WhatsApp Web
};
