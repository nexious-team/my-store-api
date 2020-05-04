const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server.test');
const data = require('../data.json');
const { clear, clearAndInsert } = require('../helper');
const Models = require('../../models');

chai.should();

const state = {
  model: 'order_detail',
  endpoint: 'order-details',
  adminLoginBody: {
    email: data.admin.email,
    password: data.admin.password,
  },
  token: '',
  id: '',
  createBody: data.order_detail[0],
  updateBody: {
    quantity: 3,
    price: 7,
    amount: 21
  },
  key: 'amount'
}

chai.use(chaiHttp);

const models = ['brand', 'category', 'product', 'unit', 'product_unit', 'supplier', 'import', 'import_detail', 'stock', 'order'];

describe(state.model.toUpperCase(), () => {
  before(async (done) => {
    for (let model of models) {
      await clearAndInsert(model, data[model]);
    }
    await clear(state.model);

    chai.request(server)
      .post('/api/staff/login')
      .send(state.adminLoginBody)
      .end((err, res) => {
        if (err) done(err);
        else {
          res.should.have.status(200);
          res.body.should.be.a('object');
          state.token = res.body.payload.token;
          done();
        }
      });
  });

  describe(`GET ${state.endpoint}`, () => {
    it(`it should GET all the ${state.model}`, (done) => {
      chai.request(server)
        .get(`/api/${state.endpoint}`)
        .set('x-store', state.token)
        .end((err, res) => {
          if (err) done(err);
          else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.payload.should.be.a('array');
            done();
          }
        });
    });
  });

  describe(`POST ${state.model}`, () => {
    before(async (done) => {
      try {
        state.filter = { _product: data.order_detail[0]._product };
        state.stock = await Models.stock.findOne(state.filter);
        done();
      } catch (err) {
        done(err);
      }
    });

    it(`it should create a ${state.model}`, (done) => {
      chai.request(server)
        .post(`/api/${state.endpoint}`)
        .set('x-store', state.token)
        .send(state.createBody)
        .end((err, res) => {
          if (err) done(err);
          else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.payload.should.be.a('object');
            res.body.payload.should.have.property('_id');
            state.id = res.body.payload._id;
            state.payload = res.body.payload;
            done();
          }
        });
    });

    it(`it should decrease product stock`, async (done) => {
      try {
        const newStock = await Models.stock.findOne(state.filter);
        newStock.quantity.should.be.below(state.stock.quantity);
        state.stock = newStock;
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe(`GET a ${state.model}`, () => {
    it(`it should GET the ${state.model}`, (done) => {
      chai.request(server)
        .get(`/api/${state.endpoint}/${state.id}`)
        .set('x-store', state.token)
        .end((err, res) => {
          if (err) done(err);
          else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.payload.should.be.a('object').have.property('_id').eql(state.id);
            done();
          }
        });
    });

    it(`it should not found`, (done) => {
      chai.request(server)
        .get(`/api/${state.endpoint}/${data.brand._id}`)
        .set('x-store', state.token)
        .end((err, res) => {
          res.should.have.status(404);
          console.log(res.body);
          done();
        })
    });
  });

  describe(`PUT the ${state.model}`, () => {
    it(`it should update the ${state.model}`, (done) => {
      chai.request(server)
        .put(`/api/${state.endpoint}/${state.id}`)
        .set('x-store', state.token)
        .send(state.updateBody)
        .end((err, res) => {
          if (err) done(err);
          else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.payload.should.be.a('object').have.property(state.key).eql(state.updateBody[state.key]);
            done();
          }
        });
    });
  });

  describe(`DELETE the ${state.model}`, () => {
    it(`it should delete the ${state.model}`, (done) => {
      chai.request(server)
        .delete(`/api/${state.endpoint}/${state.id}`)
        .set('x-store', state.token)
        .end((err, res) => {
          if (err) done(err);
          else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.payload.should.be.a('object').have.property('_id').eql(state.id);
            done();
          }
        });
    });

    it('it should increase product stock', async (done) => {
      try {
        const updateStock = await Models.stock.findOne(state.filter);
        updateStock.quantity.should.be.above(state.stock.quantity);
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
