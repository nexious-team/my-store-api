const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server.test');
const data = require('../data.json');

chai.should();

const state = {
  model: 'call',
  endpoint: 'calls',
  adminLoginBody: {
    email: data.admin.email,
    password: data.admin.password,
  },
  token: '',
  id: '',
  createBody: {
    _caller: data.admin._id,
    caller_ref: "Staff",
    method: "POST",
    original_url: "/api/products"
  },
  updateBody: {
    method: "GET"
  },
  key: 'method'
}

chai.use(chaiHttp);

describe(state.model.toUpperCase(), () => {
  before((done) => {
    chai.request(server)
      .post('/api/staff/login')
      .send(state.adminLoginBody)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        state.token = res.body.payload.token;
        done();
      });
  });

  describe(`GET ${state.endpoint}`, () => {
    it(`it should GET all the ${state.model}`, (done) => {
      chai.request(server)
        .get(`/api/${state.endpoint}`)
        .set('x-store', state.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.payload.should.be.a('array');
          done();
        });
    });
  });

  describe(`POST ${state.model}`, () => {
    it(`it should create a ${state.model}`, (done) => {
      chai.request(server)
        .post(`/api/${state.endpoint}`)
        .set('x-store', state.token)
        .send(state.createBody)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.payload.should.be.a('object');
          res.body.payload.should.have.property('_id');
          state.id = res.body.payload._id;
          done();
        });
    });
  });

  describe(`GET a ${state.model}`, () => {
    it(`it should GET the ${state.model}`, (done) => {
      chai.request(server)
        .get(`/api/${state.endpoint}/${state.id}`)
        .set('x-store', state.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.payload.should.be.a('object').have.property('_id').eql(state.id);
          done();
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
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.payload.should.be.a('object').have.property(state.key).eql(state.updateBody[state.key]);
          done();
        });
    });
  });

  describe(`DELETE the ${state.model}`, () => {
    it(`it should delete the ${state.model}`, (done) => {
      chai.request(server)
        .delete(`/api/${state.endpoint}/${state.id}`)
        .set('x-store', state.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.payload.should.be.a('object').have.property('_id').eql(state.id);
          done();
        });
    });
  });
});
