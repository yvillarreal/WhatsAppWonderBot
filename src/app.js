const app = require('./welcome'); // Importa el objeto app desde form.js
const {startWhatsApp} = require('./module/whatsapp');
const express = require('express');


// Inicializa WhatsApp
startWhatsApp();

// Iniciar el servidor Express
const port = 3001;

// Configura Express para servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
