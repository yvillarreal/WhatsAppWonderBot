function handleCommands(clientInstance) {

    clientInstance.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage.includes('/comandos')) {
            // Responde con la lista de comandos disponibles
            const commandList = 'Comandos Disponibles:\n' +
                '📋 /comandos - Mostrar esta lista de comandos disponibles.\n' +
                '📜 /ver_programados - Ver mensajes programados.\n' +
                '📅 /programar [HH:mm] [numero] [mensaje] - Programar un mensaje.\n';

            await clientInstance.sendText(message.from, commandList);
        }
    });
}

module.exports = {handleCommands};
