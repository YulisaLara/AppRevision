document.addEventListener('DOMContentLoaded', function () {
    // Agrega el evento 'click' al botón con el ID 'confirmButton'
    document.getElementById('confirmButton').addEventListener('click', function () {
        // Realizar la solicitud DELETE al servidor
        fetch('/delete-account', {
            method: 'DELETE'
        })
        .then(response => {
            // Crear un elemento para la alerta
            const alertContainer = document.getElementById('alertContainer');
            const alertElement = document.createElement('div');
            alertElement.classList.add('alert', 'mt-3');

            // Verificar si la eliminación se realizó con éxito
            if (response.status === 200) {
                // Configurar la alerta de éxito
                alertElement.classList.add('alert-success');
                alertElement.innerHTML = '<strong>Éxito:</strong> La cuenta se eliminó correctamente.';
                // Redirigir al usuario a una página de confirmación o a la página de inicio de sesión
            } else {
                // Configurar la alerta de error
                alertElement.classList.add('alert-danger');
                alertElement.innerHTML = '<strong>Error:</strong> No se pudo eliminar la cuenta. Por favor, inténtalo de nuevo.';
                // Manejar errores
                console.error('Error al eliminar la cuenta');
            }

            // Agregar la alerta al contenedor
            alertContainer.innerHTML = '';
            alertContainer.appendChild(alertElement);
        })
        .catch(error => {
            // Manejar errores
            console.error(error);
        });
    });
});