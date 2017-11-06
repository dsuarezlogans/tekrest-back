'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UsuarioSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'EMAIL_EXISTS'],
    required: [true, 'NO_EMAIL'],
    lowercase: true,
    minlength: 1,
    trim: true,
    validate: {
      validator: function(v) {
        return v.indexOf('tekton') > -1;
      },
      message: '{VALUE} no es un email valido!'
    }
  },
  nombre: {
    type: String,
    required: [true, 'NO_USERNAME'],
    minlength: 1,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'NO_PASS']
  },
  rol: {
    type: String,
    required: [true, 'NO_USERNAME'],
    enum: ['Admin', 'Chef', 'Cajero']
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
