const { ObjectID } = require('mongodb');

module.exports = {
  PORT: process.env.PORT || '5000',
  MONGODB: process.env.MONGODB || 'mongodb://localhost:27017/tekrest',
  SECRET_TOKEN: process.env.SECRET_TOKEN || 'SuperClaveSecreta',
  TEST_DATA: [
    {
      _id: new ObjectID(),
      estado: 'Comanda',
      cliente: 'John Doe',
      tipoPago: 'Efectivo',
      montoTotal: 1100,
      pedido: {
        nombre: 'Pasticcio',
        descripcion: 'Lasagna con carne molida, jamon, queso y crema bechamel',
        monto: '1100'
      }
    },
    {
      _id: new ObjectID(),
      estado: 'Comanda',
      cliente: 'Jane Doe',
      tipoPago: 'Efectivo',
      montoTotal: 900,
      pedido: [
        {
          nombre: 'Ramen',
          descripcion: 'Sopa de fideos y vegetales.',
          monto: '400'
        },
        {
          nombre: 'Sushi',
          descripcion: 'Pescado crudo con arroz.',
          monto: '500'
        }
      ]
    }
  ],
  TEST_DATA_ONE: {
    estado: 'Comanda',
    cliente: 'Jimmy Doe',
    tipoPago: 'Tarjeta',
    montoTotal: 2000,
    pedido: {
      nombre: 'Carbonara',
      descripcion: 'Spaguetti con con ingredientes especiales',
      monto: '1100'
    }
  }
};
