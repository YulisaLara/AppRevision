const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const conexion = require("../database/db");
const { promisify } = require("util");
const { error } = require("console");

exports.login = async (req, res) => {
    try {
        const user = req.body.usuario
        const password = req.body.password
        if (!user || !password) {
            res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        } else {
            conexion.query('SELECT * FROM usuario WHERE nombreUsuario = ?', [user], async (error, results) => {
                if (results.length == 0 || !(await bcryptjs.compare(password, results[0].contrasena))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'

                    })
                } else {
                    //Inicio de sesión exitoso
                    const idUsuario = results[0].idUsuario;
                    const token = jwt.sign({ idUsuario: idUsuario }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_TIME_EXPIRES
                    });

                    console.log("TOKEN: " + token + " para el USUARIO: " + user)
                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión Exitosa",
                        alertMessage: "Login Verificado",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: 'dashboard'
                    })
                }
            })
        }
        console.log("Usuario: " + user + " Contraseña: " + password)
    } catch (error) {
        console.log(error)

    }

}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            conexion.query('SELECT * FROM usuario WHERE idUsuario = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }

    } else {
        res.redirect('/login')
    }
}



exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}

exports.register = async (req, res) => {
    try {
        const nombre = req.body.nombre;
        const apellidoPaterno = req.body.apellidoPaterno;
        const apellidoMaterno = req.body.apellidoMaterno;
        const correo = req.body.correo;
        const usuario = req.body.usuario;
        const edad = req.body.edad;
        const password = req.body.password;
        let passHash = await bcryptjs.hash(password, 8);

        // Verificar que todos los campos estén completos
        if (!nombre || !apellidoPaterno || !apellidoMaterno || !correo || !usuario || !edad || !password) {
            return res.render('register', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Por favor, complete todos los campos",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        }

        // Verificar si el nombre de usuario o el correo ya existen en la base de datos
        conexion.query(
            "SELECT * FROM usuario WHERE nombreUsuario = ? OR correo = ?",
            [usuario, correo],
            (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send("Error interno del servidor");
                }

                if (results.length > 0) {
                    // El nombre de usuario o el correo ya están en uso
                    return res.render('register', {
                        alert: true,
                        alertTitle: "Advertencia",
                        alertMessage: "El nombre de usuario o el correo ya están en uso",
                        alertIcon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'register'
                    });
                }

                // Si no hay registros previos con el mismo nombre de usuario o correo, realizar la inserción
                conexion.query(
                    "INSERT INTO usuario SET ?",
                    {
                        nombre: nombre,
                        apellidoPaterno: apellidoPaterno,
                        apellidoMaterno: apellidoMaterno,
                        correo: correo,
                        nombreUsuario: usuario,
                        edad: edad,
                        contrasena: passHash
                    },
                    (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).send("Error interno del servidor");
                        }
                        res.render('login', {
                            alert: true,
                            alertTitle: "Registro Exitoso",
                            alertMessage: "Su cuenta ha sido registrada correctamente",
                            alertIcon: 'success',
                            showConfirmButton: true,
                            timer: 3000,
                            ruta: 'login'
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
    }
};

