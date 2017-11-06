'use strict';

const mongoose = require('mongoose');

const PlatoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'NO_DISHNAME']
  },
  descripcion: {
    type: String,
    required: [true, 'NO_DISHDESC']
  },
  monto: {
    type: String,
    required: [true, 'NO_DISHAMOUNT']
  }
});

module.exports = mongoose.model('Plato', PlatoSchema);
