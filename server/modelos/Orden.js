'use strict';

const mongoose = require('mongoose');

const Plato = require('./Plato');

const OrdenSchema = new mongoose.Schema(
  {
    estado: {
      type: String,
      required: [true, 'NO_STATUS'],
      enum: ['Comanda', 'En proceso', 'Terminado']
    },
    cliente: {
      type: String,
      required: [true, 'NO_CLIENT'],
      minlength: 1,
      trim: true
    },
    tipoPago: {
      type: String,
      require: [true, 'NO_PAYMENT'],
      enum: ['Tarjeta', 'Efectivo']
    },
    montoTotal: {
      type: Number,
      required: [true, 'NO_AMOUNT']
    },
    pedido: [Plato.schema]
  },
  {
    timestamps: { createdAt: 'ordenCreada', updatedAt: 'ordenActualizada' }
  }
);

module.exports = mongoose.model('Orden', OrdenSchema);
