'use strict';

const express = require('express');

const userCtrl = require('../controladores/usuarios');

const login = express.Router();

login.post('/signup', userCtrl.signUp);
login.post('/signin', userCtrl.signIn);

module.exports = login;
