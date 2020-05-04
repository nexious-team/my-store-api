const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server.test');
const Models = require('../../models');
const config = require('../config.json');
const should = chai.should();

chai.use(chaiHttp);

const adminLoginBody = {
  email: "admin@store.com",
  password: "admin123",
};

describe('CRUD', () => {
  before((done) => {
    chai.request(server)
      .post('/api/staff/login')
      .send(adminLoginBody)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        TOKEN = res.body.payload.token;
        done();
      });
  });

  for (let item of config) {
    const key = Object.keys(item.updateBody)[0];

    describe(item.model.toUpperCase(), () => {
      describe(`GET ${item.endpoint}`, () => {
        it(`it should GET all the ${item.endpoint}`, (done) => {
          chai.request(server)
            .get(`/api/${item.endpoint}`)
            .set('x-store', TOKEN)
            .set('admin', true)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.payload.should.be.a('array');
              done();
            });
        });
      });

      describe(`POST ${item.endpoint}`, () => {
        it(`it should create a ${item.model}`, (done) => {
          chai.request(server)
            .post(`/api/${item.endpoint}`)
            .set('x-store', TOKEN)
            .send(item.createBody)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.payload.should.be.a('object');
              res.body.payload.should.have.property('_id');
              ID = res.body.payload._id;
              done();
            });
        });

        it(`it should not found`, (done) => {
          chai.request(server)
            .get(`/api/${state.endpoint}/${data.admin._id}`)
            .set('x-store', state.token)
            .end((err, res) => {
              res.should.have.status(404);
              console.log(res.body);
              done();
            })
        });
      });

      describe(`GET the ${item.model}`, () => {
        it(`it should GET the ${item.model}`, (done) => {
          chai.request(server)
            .get(`/api/${item.endpoint}/${ID}`)
            .set('x-store', TOKEN)
            .set('admin', true)
            .end((err, res) => {
              console.log(res.body);
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.payload.should.be.a('object').have.property('_id').eql(ID);
              done();
            });
        });
      });

      describe(`PUT the ${item.model}`, () => {
        it(`it should update the ${item.model}`, (done) => {
          chai.request(server)
            .put(`/api/${item.endpoint}/${ID}`)
            .set('x-store', TOKEN)
            .send(item.updateBody)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.payload.should.be.a('object').have.property(key).eql(item.updateBody[key]);
              done();
            });
        });
      });

      describe(`DELETE the ${item.model}`, () => {
        it(`it should delete the ${item.model}`, (done) => {
          chai.request(server)
            .delete(`/api/${item.endpoint}/${ID}`)
            .set('x-store', TOKEN)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.payload.should.be.a('object').have.property('_id').eql(ID);
              done();
            });
        });
      });
    })
  }
});
