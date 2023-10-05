const db = require('../../data/initialize_database');

//Método para guardar los mensajes en la tabla
function saveScheduledMessage(dateTime, number_to, number_from, message, status,frequency) {
    return new Promise((resolve, reject) => {
        const insertQuery = `INSERT INTO scheduled_messages (hour, minutes, number_to, number_from, message, status,frequency)
                             VALUES (?, ?, ?, ?, ?, ?,?)`;
        db.run(insertQuery, [dateTime.format('h'), dateTime.format('m'), number_to, number_from, message, status,frequency], function (err) {
            if (err) {
                console.error('Error al guardar el mensaje programado:', err.message);
                reject(err);
            } else {
                console.log('Mensaje programado guardado correctamente.');
                resolve(this.lastID);// Devuelve el ID del último registro insertado
            }
        })
    });
}


//Método para actualizar los mensajes que ha sido enviados
function updateScheduleMessage(id) {
    const updateQuery = `UPDATE scheduled_messages
                         SET status = 'enviado'
                         WHERE id = ?`;
    db.run(updateQuery, [id], (err) => {
        if (err) {
            console.error('Error al actualizar el estado del mensaje programado:', err.message);
        } else {
            console.log('Estado del mensaje programado actualizado correctamente. ID:', id);
        }
    });
}


// Método para editar un mensaje programado
function editScheduledMessage(id, newHour, newMinutes, newMessage) {
    const updateQuery = 'UPDATE scheduled_messages SET hour = ?, minutes = ?, message = ? WHERE id = ?';
    db.run(updateQuery, [newHour, newMinutes, newMessage, id], (err) => {
        if (err) {
            console.error('Error al editar el mensaje programado:', err.message);
        } else {
            console.log('Mensaje programado editado correctamente.');
        }
    });
}


// Método para eliminar un mensaje programado
function deleteScheduledMessage(id) {
    const deleteQuery = 'DELETE FROM scheduled_messages WHERE id = ?';
    db.run(deleteQuery, [id], (err) => {
        if (err) {
            console.error('Error al eliminar el mensaje programado:', err.message);
        } else {
            console.log('Mensaje programado eliminado correctamente.');
        }
    });
}


// Método para cargar mensajes no enviados
function loadPendingMessages(callback) {
    const query = 'SELECT * FROM scheduled_messages WHERE status = "programado"';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error al cargar mensajes programados:', err.message);
            callback(err, null);
        } else {
            console.log('Mensajes programados cargados correctamente.');
            callback(null, rows);
        }
    });
}



module.exports = {
    saveScheduledMessage,
    updateScheduleMessage,
    loadPendingMessages,
    editScheduledMessage,
    deleteScheduledMessage
};
