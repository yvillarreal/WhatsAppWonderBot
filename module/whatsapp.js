const {create, Client} = require('@open-wa/wa-automate');

let clientInstance; // Instancia única de WhatsApp Web

const startWhatsApp = async () => {
    clientInstance = await create({sessionId: 'my-session'});
    console.log('WhatsApp está listo.');
};

module.exports = {
    startWhatsApp, getClient: () => clientInstance,// Exporta la instancia de WhatsApp Web
};
