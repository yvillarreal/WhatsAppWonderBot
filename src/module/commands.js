function handleCommands(clientInstance) {

    clientInstance.onMessage(async (message) => {
        const lowerCaseMessage = message.body.toLowerCase();

        if (lowerCaseMessage.includes('/comandos')) {
            // Responde con la lista de comandos disponibles
            const commandList = 'Comandos Disponibles:\n' +
                '📋 /comandos - Mostrar esta lista de comandos disponibles.\n' +
                '📜 /ver_programados - Ver mensajes programados.\n' +
                '📅 /programar [frecuencia: daily,weekly] [HH:mm] [dd-MM-yyyy] [numero] [mensaje] - Programar un mensaje.\n\n*Ejemplo:*\n/programar daily 13:45 05-12-2023 505XXXXXX Hola soy un mensaje :)\n\n' +
                '✏️ /editar_programado [ID] [HH:mm] [mm] - Edita un mensaje programado.\n\n*Ejemplo:* /editar 1 14:30 Nuevo mensaje\n\n' +
                '❌ /eliminar_programado [ID] - Elimina un mensaje programado por ID.\n\n*Ejemplo:* /eliminar_programado 1';

            await clientInstance.sendText(message.from, commandList);
        }
    });
}

module.exports = {handleCommands};
