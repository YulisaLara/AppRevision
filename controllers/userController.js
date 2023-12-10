const conexion = require("../database/db");
const { promisify } = require("util");
const { error } = require("console");

exports.eliminarCuenta = async (req, res) => {
    try {
        // Obtener el ID del usuario actual desde el token o la sesión (dependiendo de cómo lo manejes)
        const userId = req.idUsuario; // Ajusta esto según tu implementación
        console.log(userId);

        // Realizar la eliminación de la cuenta en la base de datos
        const query = 'DELETE FROM usuario WHERE idUsuario = ?';

        // Manejo de errores con una promesa
        await new Promise((resolve, reject) => {
            conexion.query(query, [userId], (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        // Limpiar las cookies u otros datos de autenticación
        res.clearCookie('jwt');

        // Redirigir al usuario a una página de confirmación de eliminación o a la página de inicio de sesión
        res.render('delete-account', {
            alert: true,
            alertTitle: "Usuario eliminado",
            alertMessage: "Será reedirigido a la página principal",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 3000,
            ruta: ''
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar la cuenta.' });
    }
};

exports.obtenerDatos = async (req, res) => {
    try {
        const userId = req.idUsuario;
        const query = 'SELECT * FROM usuario WHERE idUsuario = ?';

        const executeQuery = () => {
            return new Promise((resolve, reject) => {
                conexion.query(query, [userId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        const result = await executeQuery();

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = result[0];
        const datosConcatenados = {
            nombre: usuario.nombre,
            apellidoPaterno: usuario.apellidoPaterno,
            apellidoMaterno: usuario.apellidoMaterno,
            edad: usuario.edad,
            correo: usuario.correo,
            nombreUsuario: usuario.nombreUsuario,
        };
        res.render('settings', { alert: false, datosConcatenados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario.' });
    }
};

exports.obtenerDatos2 = async (req, res) => {
    try {
        const userId = req.idUsuario;
        const query = 'SELECT * FROM usuario WHERE idUsuario = ?';

        const executeQuery = () => {
            return new Promise((resolve, reject) => {
                conexion.query(query, [userId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        const result = await executeQuery();

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = result[0];
        const datosConcatenados = {
            nombre: usuario.nombre,
            apellidoPaterno: usuario.apellidoPaterno,
            apellidoMaterno: usuario.apellidoMaterno,
            edad: usuario.edad,
            correo: usuario.correo,
            nombreUsuario: usuario.nombreUsuario,
        };
        res.render('dashboard', { datosConcatenados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario.' });
    }
};

exports.actualizarDatos = async (req, res) => {
    try {
        const userId = req.idUsuario;
        const { nombre, apellidoPaterno, apellidoMaterno, edad, correo, nombreUsuario } = req.body;

        // Verificar que se proporcionen los datos necesarios
        if (!nombre || !apellidoPaterno || !apellidoMaterno || !edad || !correo || !nombreUsuario) {
            return res.render('settings', {
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'Todos los campos son obligatorios',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'settings'
            });
        }

        // Verificar si hay registros con información similar
        const verificaRegistro = `
            SELECT * FROM usuario
            WHERE (nombre = ? AND apellidoPaterno = ? AND apellidoMaterno = ?)
            OR (correo = ?)
            OR (nombreUsuario = ? AND idUsuario != ?)
        `;

        conexion.query(verificaRegistro, [nombre, apellidoPaterno, apellidoMaterno, correo, nombreUsuario, userId], (error, resultados) => {
            if (error) {
                console.error(error);
                return res.render('settings', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: 'Error al verificar registros duplicados',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'settings'
                });
            }

            if (resultados.length > 0) {
                // Hay registros duplicados, no permitir la actualización
                return res.render('settings', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: 'No se permiten datos duplicados',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'settings'
                });
            }

            // No hay registros duplicados, proceder con la actualización
            const updateQuery = `
                UPDATE usuario
                SET nombre = ?, apellidoPaterno = ?, apellidoMaterno = ?, edad = ?, correo = ?, nombreUsuario = ?
                WHERE idUsuario = ?
            `;

            // Ejecutar la consulta preparada
            conexion.query(updateQuery, [nombre, apellidoPaterno, apellidoMaterno, edad, correo, nombreUsuario, userId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.render('settings', {
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'Error al actualizar los datos',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'settings'
                    });
                }

                // Verificar si se actualizó algún registro
                if (result.affectedRows > 0) {
                    return res.render('settings', {
                        alert: true,
                        alertTitle: 'Conexión Exitosa',
                        alertMessage: 'Datos actualizados correctamente',
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: 'settings'
                    });
                } else {
                    return res.render('settings', {
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'Usuario no encontrado',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'settings'
                    });
                }
            });
        });
    } catch (error) {
        console.error(error);
        return res.render('settings', {
            alert: true,
            alertTitle: 'Error',
            alertMessage: 'Error al actualizar los datos.',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'settings'
        });
    }
};





