const db = require('../data/initialize_database');


function saveScheduledMessage(hour, minutes, number, message, status) {
    const insertQuery = `INSERT INTO scheduled_messages (hour, minutes, number, message, status)
                         VALUES (?, ?, ?, ?, ?)`;
    db.run(insertQuery, [hour, minutes, number, message], (err) => {
        if (err) {
            console.error('Error al guardar el mensaje programado:', err.message);
        } else {
            console.log('Mensaje programado guardado correctamente.');
        }
    })

    db.close();
}


module.exports = {saveScheduledMessage};
