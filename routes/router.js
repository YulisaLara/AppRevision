const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const verificaJWT = require('../middlewares/verificaJWT')

//Rutas para las vistas
router.get('/', (req, res) => {
    res.render('index')
})
router.get('/login', (req, res) => {
    res.render('login', { alert: false })
})
router.get('/register', (req, res) => {
    res.render('register', { alert: false })
})
router.get('/aboutus', (req, res) => {
    res.render('aboutus', { alert: false })
})

//Vistas protegidas
router.get('/dashboard', authController.isAuthenticated, verificaJWT, userController.obtenerDatos2, (req, res) => {
    res.render('dashboard', { datosConcatenados })
})

router.get('/courses', authController.isAuthenticated, (req, res) => {
    res.render('courses')
})

router.get('/courses-beginner', authController.isAuthenticated, (req, res) => {
    res.render('courses-beginner')
})

router.get('/courses-advanced', authController.isAuthenticated, (req, res) => {
    res.render('courses-advanced')
})

router.get('/courses-intermediate', authController.isAuthenticated, (req, res) => {
    res.render('courses-intermediate')
})

router.get('/settings', authController.isAuthenticated, verificaJWT, userController.obtenerDatos, (req, res) => {
    res.render('settings', { alert: false, datosConcatenados });
});

router.get('/obtenerDatos/:idUsuario', userController.obtenerDatos);

router.put('/update-profile', authController.isAuthenticated, verificaJWT, userController.actualizarDatos);

router.get('/delete-account', authController.isAuthenticated, verificaJWT, (req, res) => {
    res.render('delete-account', { alert: false })
})

//Rutas para los métodos del controlador
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

// Ruta para eliminar la cuenta (requiere autenticación)
router.delete("/delete-account", authController.isAuthenticated, verificaJWT, userController.eliminarCuenta);


module.exports = router