const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server.test');
const data = require('../data.json');
const { clear, clearAndInsert } = require('../helper');
const Models = require('../../models');

chai.should();

const state = {
  model: 'import_detail',
  endpoint: 'import-details',
  adminLoginBody: {
    email: data.admin.email,
    password: data.admin.password,
  },
  token: '',
  id: '',
  createBody: data.import_detail,
  updateBody: {
    quatity: 3,
    price: 12,
    amount: 36
  },
  key: 'amount'
}

chai.use(chaiHttp);

const models = ['brand', 'category', 'product', 'product_unit', 'supplier', 'import', 'stock'];

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
        state.filter = { _product: data.import_detail._product };
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
            console.log(res.body)
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.payload.should.be.a('object');
            res.body.payload.should.have.property('_id');
            state.id = res.body.payload._id;
            done();
          }
        });
    });

    it('it should increase product stock', async (done) => {
      try {
        const updateStock = await Models.stock.findOne(state.filter);
        updateStock.quantity.should.be.above(state.stock.quantity);
        state.stock = updateStock;
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
    it(`it should decrease the product stock`, async (done) => {
      try {
        const updateStock = await Models.stock.findOne(state.filter);
        updateStock.quantity.should.be.below(state.stock.quantity);
        done();
      } catch (err) {
        done(err);
      }
    })
  });
});
