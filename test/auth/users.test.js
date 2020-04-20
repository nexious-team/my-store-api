const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server.test');
const Models = require('../../models');

chai.should();

chai.use(chaiHttp);

let TOKEN, ID;

const signUpBody = {
  first_name: "Sok",
  last_name: "San",
  username: "soksan",
  email: "soksan@store.com",
  password: "user123",
}

const loginBody = {
  email: signUpBody.email,
  password: signUpBody.password,
}

describe('User authentication', () => {
  before((done) => {
    setTimeout(async () => {
      await Models.user.deleteMany({});
      await Models.role.deleteMany({ role: 'user' });
      done();
    }, 5000);
  });

  describe('Sign up', () => {
    it('it should sign user up', (done) => {
      chai.request(server)
        .post('/api/users/signup')
        .send(signUpBody)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.payload.should.be.a('object');
          res.body.payload.should.have.property('username').eql(signUpBody.username);
          done();
        });
    });
  });

  describe('Login', () => {
    it('it should log user in', (done) => {
      chai.request(server)
        .post('/api/users/login')
        .send(loginBody)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.payload.should.be.a('object');
          TOKEN = res.body.payload.token;
          done();
        });
    });
  });

  describe('GET profile', () => {
    it('it should get user profile', (done) => {
      chai.request(server)
        .get('/api/users/profile')
        .set('x-store', TOKEN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.payload.should.be.a('object').have.property('_id').be.a('string');
          done();
        });
    });
  });
});

