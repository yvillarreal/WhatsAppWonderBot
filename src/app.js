const app = require('./welcome'); // Importa el objeto app desde form.js
const {startWhatsApp} = require('./module/whatsapp');

// Inicializa WhatsApp
startWhatsApp();

// Iniciar el servidor Express
const port = 3001;
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
