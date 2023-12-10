const jwt = require('jsonwebtoken');


function verificaJWT(req, res, next) {
    const token = req.cookies.jwt; // Obtén el token desde las cookies

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Token no válido' });
            } else {
                // El token es válido, puedes acceder a la información del usuario
                req.idUsuario = decoded.idUsuario;
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'Token no proporcionado' });
    }
}

module.exports = verificaJWT;

