const fs = require('fs');

async function getMediaFromHost(clientInstance, outputDirectory = 'media') {
    const client = clientInstance;
    const hostNumber = client._hostAccountNumber;

    // Obtenemos todos los mensajes del host
    const messages = await client.getAllMessagesInChat(`${hostNumber}@c.us`, false);

    // Creamos el directorio de salida si no existe
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }

    // Iteramos a través de los mensajes y guardamos los archivos multimedia
    messages.forEach((message) => {
        if (message.hasMedia) {
            const mediaFileName = `${outputDirectory}/${message.fileName || 'unknown_file'}`;
            const mediaData = message.downloadMedia();
            fs.writeFileSync(mediaFileName, mediaData);
            console.log(`Guardado: ${mediaFileName}`);
        }
    });

    console.log('Proceso multimedia completado.');
}


module.exports = {getMediaFromHost};
