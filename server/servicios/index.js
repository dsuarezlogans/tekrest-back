'use strict';

const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const jwt = require('jwt-simple');

const config = require('../config');

function crearToken(usuario) {
  const payload = {
    sub: usuario._id,
    iat: moment().unix(),
    exp: moment()
      .add(5, 'days')
      .unix()
  };

  return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken(token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.SECRET_TOKEN);
      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          success: false,
          mensaje: 'Token ha expirado'
        });
      }

      resolve(payload.sub);
    } catch (err) {
      reject({
        status: 500,
        success: false,
        mensaje: 'Token Invalido'
      });
    }
  });

  return decoded;
}

function encryptPass(password) {
  return new Promise((resolve, reject) => {
    if (!password) {
      reject('Por favor suministre una contraseña!');
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);

      bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
}

module.exports = {
  crearToken,
  decodeToken,
  encryptPass
};
