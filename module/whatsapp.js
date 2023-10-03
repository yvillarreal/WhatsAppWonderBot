const {create, Client} = require('@open-wa/wa-automate');
const {handleCommands} = require('./commands');
const {scheduleMessage} = require('./scheduler');
const {loadContacts} = require('./contacts');

let clientInstance;

async function startWhatsApp() {
    clientInstance = await create({sessionId: 'my-session'});
    console.log("Cargando módulo de contactos.")
    loadContacts(clientInstance);
    console.log("Cargando módulo de comandos.")
    handleCommands(clientInstance);
    scheduleMessage(clientInstance);
    console.log('🚀 WhatsAppWonderBot está listo. 🚀');
}

function getClient() {
    return clientInstance;
}

module.exports = {
    startWhatsApp,
    getClient,
};
