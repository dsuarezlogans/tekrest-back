'use strict';

const express = require('express');

const auth = require('../middlewares/auth');
const ordenesCtrl = require('../controladores/ordenes');
const userCtrl = require('../controladores/usuarios');
const platoCtrl = require('../controladores/platos');

const api = express.Router();

api
  .route('/ordenes')
  .get(auth, ordenesCtrl.buscar)
  .post(auth, ordenesCtrl.registrar);

api
  .route('/ordenes/:id')
  .get(auth, ordenesCtrl.buscarPor)
  .put(auth, ordenesCtrl.cambiarEstado);

api
  .route('/platos')
  .get(auth, platoCtrl.listar)
  .post(auth, platoCtrl.agregar);

api.route('/caja').get(auth, ordenesCtrl.flucoCaja);
api.route('/ventasdia').get(auth, ordenesCtrl.ventasDia);
api.route('/ventas').get(auth, ordenesCtrl.ventasTotal);
api.route('/usuarios').get(auth, userCtrl.usuarios);

api
  .route('/usuarios/:id')
  .get(auth, userCtrl.usuarioPorId)
  .put(auth, userCtrl.modificarUsuario);

module.exports = api;
