'use strict';

const bcrypt = require('bcrypt-nodejs');
const { ObjectID } = require('mongodb');

const Usuario = require('../modelos/Usuario');
const servicios = require('../servicios');

function signIn(req, res) {
  Usuario.findOne({ email: req.body.email }, (error, usuario) => {
    if (error) {
      return res.status(500).send({ mensaje: error });
    }
    if (!usuario) {
      return res.status(404).send({ mensaje: 'No existe el usuario' });
    }

    bcrypt.compare(req.body.password, usuario.password, function(err, resp) {
      if (!resp)
        return res.status(400).jsonp({
          success: false,
          mensaje: 'contraseña invalida'
        });

      const token = servicios.crearToken(usuario);

      return res.status(202).jsonp({
        success: true,
        mensaje: 'sesion iniciada',
        nombre: `${usuario.nombre}`,
        rol: `${usuario.rol}`,
        token: token
      });
    });
  });
}

function signUp(req, res) {
  let hash = servicios.encryptPass(req.body.password);

  hash
    .then(pass => {
      const usuario = new Usuario({
        email: req.body.email,
        nombre: req.body.nombre,
        password: pass,
        rol: req.body.rol
      });
      return usuario;
    })
    .then(usuario => usuario.save())
    .then(results => {
      return res.status(200).jsonp({
        success: true,
        message: `Bienvenido ${req.body
          .nombre} te has registrado exitosamente!`,
        token: servicios.crearToken(results)
      });
    })
    .catch(error => res.status(500).jsonp({ success: false, mensaje: error }));
}

function usuarios(req, res) {
  Usuario.find({}, { password: 0 })
    .then(usuarios => res.status(200).jsonp(usuarios))
    .catch(error => res.status(500).jsonp());
}

function usuarioPorId(req, res) {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).jsonp();
  }
  Usuario.findById(id)
    .then(usuario => {
      if (!usuario) return res.status(404).send();

      res.status(200).jsonp({
        nombre: usuario.nombre,
        rol: usuario.rol,
        email: usuario.email
      });
    })
    .catch(error => res.status(400).jsonp(error));
}

function modificarUsuario(req, res) {
  Usuario.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        nombre: req.body.nombre,
        rol: req.body.rol,
        email: req.body.email
      }
    },
    { new: true }
  )
    .then(usuario => {
      if (!usuario) {
        return res.status(404).send();
      }

      res.status(200).jsonp({
        success: true,
        mensaje: `Usuario ${req.body.nombre} modificado con exito.`
      });
    })
    .catch(e => {
      res.status(500).send();
    });
}

module.exports = {
  signIn,
  signUp,
  usuarios,
  modificarUsuario,
  usuarioPorId
};
