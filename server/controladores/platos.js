'use strict';

const Plato = require('../modelos/Plato');

function listar(req, res) {
  Plato.find()
    .then(platos => {
      if (!platos) {
        return res.status(400).jsonp();
      }
      return res.status(200).jsonp(platos);
    })
    .catch(error => {
      return res.status(500).jsonp(error);
    });
}

function agregar(req, res) {
  const plato = new Plato({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    monto: req.body.monto
  });

  plato
    .save()
    .then(plato => res.status(200).jsonp(plato))
    .catch(error => res.status(400).jsonp(error));
}

module.exports = {
  listar,
  agregar
};
