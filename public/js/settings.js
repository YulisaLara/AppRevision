document.addEventListener('DOMContentLoaded', function () {
    const editarBtn = document.getElementById('editarBtn');
    const eliminarBtn = document.getElementById('eliminarBtn');
    const camposEditables = document.querySelectorAll('.form-control[readonly]:not(#nombreUsuario)');
    const guardarBtn = document.createElement('a');
    const cancelarBtn = document.createElement('a');

    // Configura los botones Guardar Cambios y Cancelar
    guardarBtn.className = 'btn btn-primary';
    guardarBtn.textContent = 'Guardar Cambios';
    guardarBtn.id = 'guardarBtn';

    cancelarBtn.className = 'btn btn-danger';
    cancelarBtn.textContent = 'Cancelar';
    cancelarBtn.id = 'cancelarBtn';

    const editarHandler = function () {
        camposEditables.forEach(function (campo) {
            campo.removeAttribute('readonly');
        });

        // Reemplaza el botón Editar con Guardar Cambios y Cancelar
        editarBtn.replaceWith(guardarBtn);
        eliminarBtn.replaceWith(cancelarBtn);

        guardarBtn.addEventListener('click', async function guardarCambiosHandler() {
            try {
                // Lógica para obtener los datos actualizados del formulario
                const nombre = document.getElementById('nombre').value;
                const apellidoPaterno = document.getElementById('apellidoPaterno').value;
                const apellidoMaterno = document.getElementById('apellidoMaterno').value;
                const edad = document.getElementById('edad').value;
                const correo = document.getElementById('correo').value;
                const nombreUsuario = document.getElementById('nombreUsuario').value;
                
                // Realiza una solicitud HTTP para enviar los datos actualizados al servidor
                const response = await fetch('/update-profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombreUsuario,
                        nombre,
                        apellidoPaterno,
                        apellidoMaterno,
                        edad,
                        correo,
                    }),
                });

                // Maneja la respuesta del servidor
                const responseData = await response.json();
                if (response.ok) {
                    // Éxito: Puedes mostrar un mensaje, actualizar la interfaz, etc.
                    console.log(responseData.message);

                    // Reemplaza los botones Guardar Cambios y Cancelar con Editar
                    camposEditables.forEach(function (campo) {
                        campo.setAttribute('readonly', true);
                    });

                    guardarBtn.replaceWith(editarBtn);
                    cancelarBtn.replaceWith(eliminarBtn);

                    guardarBtn.removeEventListener('click', guardarCambiosHandler);
                    cancelarBtn.removeEventListener('click', cancelarHandler);
                } else {
                    // Error: Muestra un mensaje de error en formato JSON
                    console.error(responseData.message);
                    alert('Error: ' + responseData.message);
                }
            } catch (error) {
                // Error en la lógica del cliente (no en la respuesta del servidor)
                console.error(error);
            }
        });

        const cancelarHandler = function () {
            camposEditables.forEach(function (campo) {
                campo.setAttribute('readonly', true);
            });

            // Reemplaza los botones Guardar Cambios y Cancelar con Editar
            cancelarBtn.replaceWith(eliminarBtn);
            guardarBtn.replaceWith(editarBtn);

            guardarBtn.removeEventListener('click', guardarCambiosHandler);
            cancelarBtn.removeEventListener('click', cancelarHandler);
        };

        cancelarBtn.addEventListener('click', cancelarHandler);
    };

    editarBtn.addEventListener('click', editarHandler);
});
