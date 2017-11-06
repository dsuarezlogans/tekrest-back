'use strict';

const expect = require('expect');
const request = require('supertest');

const { TEST_DATA, TEST_DATA_ONE } = require('../config');
const { server } = require('../server');
const Orden = require('../modelos/Orden');

beforeEach(done => {
  Orden.remove({})
    .then(() => Orden.insertMany(TEST_DATA))
    .then(() => done());
});

describe('POST /Ordenes', () => {
  it('Debe crear una orden nueva', done => {
    request(server)
      .post('/api/ordenes')
      .set(
        'Authorization',
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWZjZjY1MTdjOGY2NTBiNjY1Nzg0YmEiLCJpYXQiOjE1MDk3NTAzNTMsImV4cCI6MTUxMDE4MjM1M30.0MCMk5ua-QGPPl2wmzPD3boqKTmQ84eu2NFjM2ULRYc'
      )
      .send(TEST_DATA_ONE)
      .expect(200)
      .expect(res => {
        expect(res.body.estado).toBe(TEST_DATA_ONE.estado);
        expect(res.body.cliente).toBe(TEST_DATA_ONE.cliente);
        expect(res.body.montoTotal).toBe(TEST_DATA_ONE.montoTotal);
        expect(res.body.tipoPago).toBe(TEST_DATA_ONE.tipoPago);
        expect(res.body.pedido[0].nombre).toBe(TEST_DATA_ONE.pedido.nombre);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        let cliente = TEST_DATA_ONE.cliente;

        Orden.find({ cliente })
          .then(ordenes => {
            expect(ordenes.length).toBe(1);
            expect(ordenes[0].estado).toBe(TEST_DATA_ONE.estado);
            expect(ordenes[0].cliente).toBe(TEST_DATA_ONE.cliente);
            expect(ordenes[0].montoTotal).toBe(TEST_DATA_ONE.montoTotal);
            expect(ordenes[0].tipoPago).toBe(TEST_DATA_ONE.tipoPago);
            expect(ordenes[0].pedido[0].nombre).toBe(
              TEST_DATA_ONE.pedido.nombre
            );
            done();
          })
          .catch(e => done(e));
      });
  });

  it('No Debe crear orden nueva con datos invalidos', done => {
    request(server)
      .post('/api/ordenes')
      .set(
        'Authorization',
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWZjZjY1MTdjOGY2NTBiNjY1Nzg0YmEiLCJpYXQiOjE1MDk3NTAzNTMsImV4cCI6MTUxMDE4MjM1M30.0MCMk5ua-QGPPl2wmzPD3boqKTmQ84eu2NFjM2ULRYc'
      )
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Orden.find()
          .then(ordenes => {
            expect(ordenes.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('PUT /ordenes/:id', () => {
  it('Debe cambiar estado de orden (En Proceso)', done => {
    let estado = 'En Proceso';
    request(server)
      .put(`/api/ordenes/${TEST_DATA[0]._id}`)
      .set(
        'Authorization',
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWZjZjY1MTdjOGY2NTBiNjY1Nzg0YmEiLCJpYXQiOjE1MDk3NTAzNTMsImV4cCI6MTUxMDE4MjM1M30.0MCMk5ua-QGPPl2wmzPD3boqKTmQ84eu2NFjM2ULRYc'
      )
      .send({ estado })
      .expect(200)
      .expect(res => {
        expect(res.body.estado).toBe(estado);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Orden.findById(TEST_DATA[0]._id.toHexString())
          .then(orden => {
            expect(orden.id).toBe(TEST_DATA[0]._id.toHexString());
            expect(orden.estado).toBe(estado);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /caja', () => {
  it('Debe traer monto total de ventas en efectivo', done => {
    request(server)
      .get('/api/caja')
      .set(
        'Authorization',
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWZjZjY1MTdjOGY2NTBiNjY1Nzg0YmEiLCJpYXQiOjE1MDk3NTAzNTMsImV4cCI6MTUxMDE4MjM1M30.0MCMk5ua-QGPPl2wmzPD3boqKTmQ84eu2NFjM2ULRYc'
      )
      .expect(200)
      .expect(res => {
        expect(res.body.caja.efectivo).toBe(2000);
        expect(res.body.caja.totalOrdenes).toBe(2);
        expect(res.body.caja.totalPlatos).toBe(3);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
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
          .then(caja => {
            console.log(caja);
            expect(caja[0].efectivo).toBe(2000);
            expect(caja[0].totalOrdenes).toBe(2);
            expect(caja[0].totalPlatos).toBe(3);
            done();
          })
          .catch(e => done(e));
      });
  });
});
