function handleCommands(clientInstance) {

    clientInstance.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage.includes('/comandos')) {
            // Responde con la lista de comandos disponibles
            const commandList = 'Comandos Disponibles:\n' +
                '📋 /comandos - Mostrar esta lista de comandos disponibles.\n' +
                '📜 /ver_programados - Ver mensajes programados.\n' +
                '📅 /programar [frecuencia: daily,weekly] [HH:mm] [dd-MM-yyyy] [numero] [mensaje] - Programar un mensaje.\n\n*Ejemplo:*\n/programar daily 13:45 05-12-2023 505XXXXXX Hola soy un mensaje :)';

            await clientInstance.sendText(message.from, commandList);
        }
    });
}

module.exports = {handleCommands};
