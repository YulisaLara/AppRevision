// Variable para almacenar la pregunta actual
var currentQuestion = 1;

// Función para mostrar u ocultar los botones según la pregunta actual
function toggleButtons() {
    var btnPrevious = document.getElementById('btnPrevious');
    var btnNext = document.getElementById('btnNext');
    var btnSubmit = document.getElementById('btnSubmit');

    // Mostrar u ocultar botón "Anterior"
    if (currentQuestion > 1) {
        btnPrevious.style.display = 'inline-block';
    } else {
        btnPrevious.style.display = 'none';
    }

    // Mostrar u ocultar botón "Siguiente" y "Enviar Respuestas"
    if (currentQuestion < 5) {
        btnNext.style.display = 'inline-block';
        btnSubmit.style.display = 'none';
    } else {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'inline-block';
    }
}

// Función para mostrar la pregunta especificada
function showQuestion(action) {
    // Validar la acción (anterior o siguiente)
    if (action === 'prev' && currentQuestion > 1) {
        currentQuestion--;
    } else if (action === 'next' && currentQuestion < 5) {
        currentQuestion++;
    }

    // Ocultar todas las preguntas
    for (var i = 1; i <= 5; i++) {
        var question = document.getElementById('question' + i);
        question.style.display = 'none';
    }

    // Mostrar la pregunta actual
    var currentQuestionElement = document.getElementById('question' + currentQuestion);
    currentQuestionElement.style.display = 'block';

    // Actualizar la visibilidad de los botones
    toggleButtons();
}

// Verificar si hay respuestas guardadas en localStorage y cargarlas
var respuestasUsuarioA = JSON.parse(localStorage.getItem('respuestasUsuarioA')) || [];

function submitForm() {
    // Verificar si todas las preguntas están respondidas
    for (var i = 1; i <= 5; i++) {
        var radioButtons = document.getElementsByName('q' + i);
        var respuestaSeleccionada = false;

        for (var j = 0; j < radioButtons.length; j++) {
            if (radioButtons[j].checked) {
                respuestaSeleccionada = true;
                break;
            }
        }

        // Mostrar alerta si alguna pregunta no está respondida
        if (!respuestaSeleccionada) {
            var alertContainer = document.getElementById('alert-container');
            var alertElement = '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                '<strong>Advertencia:</strong> Por favor, responde todas las preguntas antes de enviar.' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>';

            alertContainer.innerHTML = alertElement;
            return; // Detener la función si falta alguna respuesta
        }
    }

    // Continuar con el procesamiento si todas las preguntas están respondidas
    for (var i = 1; i <= 5; i++) {
        var radioButtons = document.getElementsByName('q' + i);
        for (var j = 0; j < radioButtons.length; j++) {
            if (radioButtons[j].checked) {
                respuestasUsuarioA[i - 1] = j + 1;
                break;
            }
        }
    }

    // Resto del código para procesar las respuestas y mostrar la alerta de éxito/error
    var respuestasCorrectas = [3, 1, 1, 1, 2];
    var respuestasCorrectasCount = 0;

    for (var k = 0; k < respuestasCorrectas.length; k++) {
        if (respuestasCorrectas[k] === respuestasUsuarioA[k]) {
            respuestasCorrectasCount++;
        }
    }

    var alertMessage = 'Respuestas correctas: ' + respuestasCorrectasCount + ' de 5';
    var alertClass;

    if (respuestasCorrectasCount === 5) {
        alertClass = 'alert-success'; // Todas las respuestas correctas
    } else if (respuestasCorrectasCount > 0) {
        alertClass = 'alert-warning'; // Al menos una respuesta correcta, pero no todas
    } else {
        alertClass = 'alert-danger'; // Ninguna respuesta correcta
    }

    var alertElement = '<div class="alert ' + alertClass + ' alert-dismissible fade show" role="alert">' +
        '<strong>' + alertMessage + '</strong>' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>';

    // Agrega la alerta al contenedor
    var alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = alertElement;
    console.log('Respuestas correctas: ' + respuestasCorrectasCount + ' de 5');

    // Guardar respuestas en localStorage
    localStorage.setItem('respuestasUsuarioA', JSON.stringify(respuestasUsuarioA));
}

// Esta función se ejecuta al cargar la página para marcar las respuestas previamente seleccionadas
function marcarRespuestasGuardadas() {
    for (var i = 1; i <= 5; i++) {
        var respuestaGuardada = respuestasUsuarioA[i - 1];
        if (respuestaGuardada) {
            var radioButton = document.getElementById('q' + i + '_option' + respuestaGuardada);
            if (radioButton) {
                radioButton.checked = true;
                radioButton.style.backgroundColor = "#ff6600";  // Modificamos aquí
            }
        }
    }
}

// Llamar a la función al cargar la página
window.onload = function () {
    showQuestion('prev'); // Inicia en la pregunta 1 al cargar la página
    // Marcar respuestas guardadas después de mostrar la primera pregunta
    marcarRespuestasGuardadas();
};
