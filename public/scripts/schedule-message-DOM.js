// Inicializar el selector de fecha
document.addEventListener('DOMContentLoaded', function () {
    const datePickers = document.querySelectorAll('.datepicker');

    // Obtiene la fecha actual
    const today = new Date();
    let dd = today.getDate() + 1;
    let mm = today.getMonth() + 1; // Enero es 0, así que sumamos 1
    const yyyy = today.getFullYear();

    // Formatea la fecha actual en el formato 'yyyy-mm-dd'
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    const currentDate = yyyy + '-' + mm + '-' + dd;

    M.Datepicker.init(datePickers, {
        format: 'yyyy-mm-dd',
        autoClose: true,
        // Establece la fecha mínima como la fecha actual
        minDate: new Date(currentDate)
    });
});

function validateHour(input) {
    const value = input.value;
    if (isNaN(value) || value < 0 || value > 23) {
        input.setCustomValidity("La hora debe estar en el rango de 0 a 23.");
    } else {
        input.setCustomValidity("");
    }
}

function validateMinutes(input) {
    const value = input.value;
    if (isNaN(value) || value < 0 || value > 59) {
        input.setCustomValidity("Los minutos deben estar en el rango de 0 a 59.");
    } else {
        input.setCustomValidity("");
    }
}