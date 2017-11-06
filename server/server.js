'use strict';

const mongoose = require('mongoose');

const app = require('./app.js');
const config = require('./config');

mongoose.Promise = global.Promise;

mongoose
  .connect(config.MONGODB, {
    useMongoClient: true
  })
  .then(() => console.log('Conectado a MongoDB satisfatoriamente.'))
  .catch(error =>
    console.error(`Error al conectar a la base de datos: ${error}`)
  );

app.listen(config.PORT, () => console.log(`Servidor corriendo en http://localhost:${config.PORT}`));

module.exports = { server: app };
