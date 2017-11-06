'use strict';

const servicios = require('../servicios');

function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'No tienes autorización' });
  }

  const token = req.headers.authorization.split(' ')[1];

  servicios
    .decodeToken(token)
    .then(respuesta => {
      req.usuario = respuesta;
      next();
    })
    .catch(error => res.status(error.status).send({ mensaje: error.message }));
}

module.exports = isAuth;
