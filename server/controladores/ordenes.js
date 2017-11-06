'use strict';

const { ObjectID } = require('mongodb');

const Orden = require('../modelos/Orden');

function buscar(req, res) {
  Orden.find()
    .then(results => res.status(200).jsonp(results))
    .catch(error => res.status(500).jsonp(error));
}

function buscarPor(req, res) {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).jsonp();
  }
  Orden.findById(id)
    .then(orden => {
      if (!orden) return res.status(404).send();

      res.status(200).jsonp(orden);
    })
    .catch(error => res.status(400).jsonp(error));
}

function cambiarEstado(req, res) {
  Orden.findByIdAndUpdate(
    req.params.id,
    { $set: { estado: req.body.estado } },
    { new: true }
  )
    .then(orden => {
      if (!orden) {
        return res.status(404).send();
      }

      res
        .status(200)
        .jsonp({ success: true, mensaje: `Orden ${req.body.estado}` });
    })
    .catch(e => {
      res.status(500).send();
    });
}

function flucoCaja(req, res) {
  let caja = {};
  Orden.aggregate([
    { $match: { tipoPago: 'Efectivo' } },
    {
      $group: {
        _id: null,
        efectivo: { $sum: '$montoTotal' },
        totalOrdenes: { $sum: 1 },
        totalPlatos: { $sum: { $size: '$pedido' } }
      }
    }
  ])
    .then(results => {
      caja = results[0];
      return Orden.find({ tipoPago: 'Efectivo' });
    })
    .then(results => res.status(200).jsonp({ caja, ordenes: results }))
    .catch(error => res.status(500).jsonp(error));
}

function ventasDia(req, res) {
  let caja = {};
  Orden.aggregate([
    {
      $group: {
        _id: {
          day: { $dayOfMonth: '$ordenCreada' },
          month: { $month: '$ordenCreada' },
          year: { $year: '$ordenCreada' }
        },
        montoTotal: { $sum: '$montoTotal' },
        totalOrdenes: { $sum: 1 },
        totalPlatos: { $sum: { $size: '$pedido' } }
      }
    }
  ])
    .then(results => res.status(200).jsonp({ ventasDia: results }))
    .catch(error => res.status(500).jsonp(error));
}

function ventasTotal(req, res) {
  let caja = {};
  Orden.aggregate([
    {
      $group: {
        _id: null,
        montoTotal: { $sum: '$montoTotal' },
        totalOrdenes: { $sum: 1 },
        totalPlatos: { $sum: { $size: '$pedido' } }
      }
    }
  ])
    .then(results => res.status(200).jsonp(results))
    .catch(error => res.status(500).jsonp(error));
}

function registrar(req, res) {
  const orden = new Orden({
    estado: 'Comanda',
    cliente: req.body.cliente,
    tipoPago: req.body.tipoPago,
    montoTotal: req.body.montoTotal,
    pedido: req.body.pedido
  });

  orden
    .save()
    .then(orden => res.status(200).jsonp(orden))
    .catch(error => res.status(400).jsonp(error));
}

module.exports = {
  registrar,
  buscar,
  buscarPor,
  flucoCaja,
  cambiarEstado,
  ventasDia,
  ventasTotal
};
