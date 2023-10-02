const {getClient} = require('./whatsapp');

function handleCommands() {
    const clientCommand = getClient(); // ToDO: VERIFICA PORQUE NO ESTA PASANDO EL CLIENTE DE WP WEB

    clientCommand.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage.includes('/comandos')) {
            // Responde con la lista de comandos disponibles
            const commandList = 'Comandos Disponibles:\n' +
                '📋 /comandos - Mostrar esta lista de comandos disponibles.\n' +
                '📜 /ver_programados - Ver mensajes programados.\n' +
                '📅 /programar [HH:mm] [numero] [mensaje] - Programar un mensaje.\n';

            await clientCommand.sendText(message.from, commandList);
        }
    });
}

module.exports = {handleCommands};
