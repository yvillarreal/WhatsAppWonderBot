const sqlite3 = require('sqlite3').verbose();

// Abre o crea la base de datos
const db = new sqlite3.Database('./data/messages.db', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Base de datos SQLite abierta correctamente.');
        // Crea la tabla si no existe
        db.run(`CREATE TABLE if not exists scheduled_messages
                (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    hour        INTEGER NOT NULL,
                    minutes     INTEGER NOT NULL,
                    number_to   TEXT    NOT NULL,
                    number_from TEXT    NOT NULL,
                    message     TEXT    NOT NULL,
                    status      TEXT    NOT NULL,
                    frequency   TEXT,
                    source      TEXT    NOT NULL
                );
        `);
    }
});

module.exports = db;
