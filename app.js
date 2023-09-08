const app = require('./src/form'); // Importa el objeto app desde form.js
const { start } = require('./src/wa');

// Iniciar WhatsApp Web
start();

// Iniciar el servidor Express
const port = 3001;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
