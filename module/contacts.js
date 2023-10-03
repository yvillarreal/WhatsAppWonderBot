const fs = require('fs');
const cron = require('node-cron');

function loadContacts(clientInstance) {
    // Carga los contactos desde el archivo contacts.json
    const contactsData = fs.readFileSync('./data/contacts.json');
    const contacts = JSON.parse(contactsData).contacts;

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
}

module.exports = {
    loadContacts,
};
