'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const volleyball = require('volleyball');

const api = require('./rutas/api');
const login = require('./rutas/login');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(volleyball);

app.use(login);
app.use('/api', api);

module.exports = app;
