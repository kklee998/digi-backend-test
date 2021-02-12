/* eslint-disable no-unused-vars */
const supertest = require('supertest');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const app = require('../app');
const knex = require('../db');
const jwt = require('../jwt');

const TEST_AUTH = jwt.sign({
  name: 'U1',
  email: 'U1@mail.com',
});

before((done) => {
  knex.table('users').delete().then(() => done());
});

describe('GET /user', () => {
  describe('GET /user, happy path', () => {
    before((done) => {
      knex.table('users').insert([{
        id: uuidv4(),
        name: 'U1',
        email: 'U1@mail.com',
        password: 'BAD UNHASHED PASSWORD',
      },
      {
        id: uuidv4(),
        name: 'U2',
        email: 'U2@mail.com',
        password: 'BAD UNHASHED PASSWORD',
      },
      {
        id: uuidv4(),
        name: 'U3',
        email: 'U3@mail.com',
        password: 'BAD UNHASHED PASSWORD',
      }]).then(() => done());
    });

    it('it should has status code 200, and list all the Users', (done) => {
      supertest(app)
        .get('/user')
        .set('Authorization', `Bearer ${TEST_AUTH}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          res.body.forEach((e) => expect(e).to.have.all.key('id', 'name', 'email'));
          return done();
        });
    });
    it('it should has status code 200 with querystring q and can filter user', (done) => {
      supertest(app)
        .get('/user?q=u1')
        .set('Authorization', `Bearer ${TEST_AUTH}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          res.body.forEach((e) => {
            expect(e.name).to.eql('U1');
            expect(e.email).to.eql('U1@mail.com');
          });
          return done();
        });
    });
  });

  describe('GET /user, bad tests', () => {
    it('it should has status code 400 with any other querystring', (done) => {
      supertest(app)
        .get('/user?b=a')
        .set('Authorization', `Bearer ${TEST_AUTH}`)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
    it('it should has status code 401 without any token', (done) => {
      supertest(app)
        .get('/user?b=a')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
  });
});

describe('POST /user for registration', () => {
  describe('Creates valid users', () => {
    it('creates a new valid user', (done) => {
      supertest(app)
        .post('/user')
        .send({ name: 'john', email: 'test@test.com', password: 'TopSneakyPassword!' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body[0]).to.have.all.key('id', 'name', 'email');
          return done();
        });
    });
  });

  describe('Bad Requests', () => {
    it('fails to create a user with existing email', (done) => {
      supertest(app)
        .post('/user')
        .send({ name: 'Bohn', email: 'test@test.com', password: 'TopSneakyPassword!' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.all.key('code', 'type', 'message');
          return done();
        });
    });
    it('fails to create a user with existing name', (done) => {
      supertest(app)
        .post('/user')
        .send({ name: 'john', email: 'test2@test.com', password: 'TopSneakyPassword!' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.all.key('code', 'type', 'message');
          return done();
        });
    });
    it('fails to create a user with bad password', (done) => {
      supertest(app)
        .post('/user')
        .send({ name: 'johnny', email: 'test3@test.com', password: 'password' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.all.key('code', 'type', 'message');
          return done();
        });
    });
  });
});

describe('POST /user/login for user login', () => {
  it('Successfully logins a valid user', (done) => {
    supertest(app)
      .post('/user/login')
      .send({ email: 'test@test.com', password: 'TopSneakyPassword!' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.all.key('message', 'accessToken');
        const { accessToken } = res.body;
        const validToken = jwt.verify(accessToken);
        expect(validToken).to.have.include.key('name', 'email');
        expect(validToken.name).to.eql('john');
        expect(validToken.email).to.eql('test@test.com');
        return done();
      });
  });
  it('Unsuccessfully logins a valid user', (done) => {
    supertest(app)
      .post('/user/login')
      .send({ email: 'test@test.com', password: 'badpassword!' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.all.key('code', 'type', 'message');
        return done();
      });
  });
});

after(() => knex.destroy());
