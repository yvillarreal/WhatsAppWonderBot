const sqlite3 = require('sqlite3').verbose();

// Abre o crea la base de datos
const db = new sqlite3.Database('./data/messages.db', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Base de datos SQLite abierta correctamente.');
        // Crea la tabla si no existe
        db.run(`CREATE TABLE IF NOT EXISTS scheduled_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hour INTEGER,
      minutes INTEGER,
      number TEXT,
      message TEXT,
      status TEXT
    )`);
    }
});

module.exports = db;
