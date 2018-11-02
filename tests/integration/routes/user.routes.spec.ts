import api from '../../../src/api';
import * as supertest from 'supertest';
import { getValidJwt, test_user } from '../../utils';
import { OwnedModel } from '../../../src/models/quantity.model';
import BeerModel from '../../../src/models/beer.model';

const jwt: string = getValidJwt();

describe('Users Routes', () => {
  describe('POST /users', () => {
    it('should create a user', done => {
      supertest(api)
        .post('/users')
        .set('Authorization', `Bearer ${jwt}`)
        .send(test_user)
        .expect(200)
        .end((err: Error, res: supertest.Response) => {
          if (err) done(err);
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.username).toEqual(test_user.username);
          test_user._id = res.body.user._id;
          done();
        });
    });
  });

  describe('GET /users', () => {
    it('should list users', done => {
      supertest(api)
        .get('/users')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .end((err: Error, res: supertest.Response) => {
          if (err) done(err);
          expect(res.body.users.length).toBeGreaterThan(0);
          done();
        });
    });
  });

  describe('GET /users/:userID', () => {
    it('should return a single user', done => {
      supertest(api)
        .get(`/users/${test_user._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .end((err: Error, res: supertest.Response) => {
          if (err) done(err);
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.username).toEqual(test_user.username);
          done();
        });
    });
  });

  describe('GET /users/me', () => {
    it('should 404 on unknown user', done => {
      supertest(api)
        .get('/users/me')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('error');
          done();
        });
    });
    it('should return a single user', done => {
      const meJWT = getValidJwt(test_user);
      supertest(api)
        .get('/users/me')
        .set('Authorization', `Bearer ${meJWT}`)
        .expect(200)
        .end((err: Error, res: supertest.Response) => {
          if (err) done(err);
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.username).toEqual(test_user.username);
          test_user._id = res.body.user._id;
          done();
        });
    });
  });

  describe('PUT /users/:userId', () => {
    it('should update the user', done => {
      supertest(api)
        .put(`/users/${test_user._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          username: 'NEW NAME'
        })
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('user');
          expect(response.body.user.username).toEqual('NEW NAME');
          done();
        });
    });
    it('should 404 on unknown :userId', done => {
      supertest(api)
        .put(`/users/123`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          username: '404 Username'
        })
        .expect(404)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('error');
          done();
        });
    });
  });

  describe('POST /users/:userId/beers', () => {
    it('should send a 404 with an unknown beer', done => {
      const beerId = '1234';
      supertest(api)
        .post(`/users/${test_user._id}/beers`)
        .send({
          beerId
        })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('error');
          done();
        });
    });
    it('should add a beer when it does not exist for the user', async done => {
      let beer;
      // create a beer
      supertest(api)
        .post('/beers')
        .send({
          name: 'Test Beer'
        })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('beer');
          beer = response.body.beer;

          supertest(api)
            .post(`/users/${test_user._id}/beers`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({
              beer: beer._id,
              amount: 1
            })
            .expect(200)
            .end((err: Error, response: supertest.Response) => {
              if (err) done(err);
              expect(response.body).toHaveProperty('user');
              expect(response.body.user).toHaveProperty('owned');
              expect(response.body.user.owned).toHaveLength(1);
              done();
            });
        });
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should successfully remove the user', done => {
      supertest(api)
        .delete(`/users/${test_user._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(204)
        .end(async (err: Error, response: supertest.Response) => {
          if (err) done(err);
          done();
        });
    });
    it('should 404 on unknown :userId', done => {
      supertest(api)
        .delete(`/users/123`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('error');
          done();
        });
    });
  });

  describe('post-cleanup', () => {
    it('should return a zero length users array', async done => {
      await OwnedModel.deleteMany({});
      await BeerModel.deleteMany({});
      supertest(api)
        .get('/users')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('users');
          expect(response.body.users).toHaveLength(0);
          done();
        });
    });
  });
});
