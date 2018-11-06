import api from '../../../src/api';
import * as supertest from 'supertest';
import { getValidJwt } from '../../utils';
import { OwnedModel } from '../../../src/models/quantity.model';
import BeerModel from '../../../src/models/beer.model';

let jwt: string = getValidJwt();
let createdUser: any = {};
describe('Users Routes', () => {
  describe('POST /users', () => {
    fit('should create a user', async done => {
      try {
        const response: supertest.Response = await supertest(api)
          .post('/users')
          .set('Authorization', `Bearer ${jwt}`)
          .send({
            username: 'testuser',
            email: 'test@email.com',
            password: 'testpassword'
          })
          .expect(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.username).toEqual('testuser');
        createdUser = response.body.user;
        jwt = getValidJwt(createdUser);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('GET /users', () => {
    it('should list users', async done => {
      try {
        const response: supertest.Response = await supertest(api)
          .get('/users')
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);
        expect(response.body.users.length).toBeGreaterThan(0);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('GET /users/:userID', () => {
    it('should return a single user', async done => {
      try {
        const response: supertest.Response = await supertest(api)
          .get(`/users/${createdUser._id}`)
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.username).toEqual(createdUser.username);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('GET /users/me', () => {
    it('should return a single user', async done => {
      // const meJWT = getValidJwt(user);
      try {
        const response: supertest.Response = await supertest(api)
          .get('/users/me')
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.username).toEqual(createdUser.username);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('PUT /users/:userId', () => {
    it('should update the user', async done => {
      try {
        const response: supertest.Response = await supertest(api)
          .put(`/users/${createdUser._id}`)
          .set('Authorization', `Bearer ${jwt}`)
          .send({
            username: 'NEW NAME'
          })
          .expect(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.username).toEqual('NEW NAME');
        done();
      } catch (e) {
        done(e);
      }
    });
    it('should 404 on unknown :userId', async done => {
      try {
        const response: supertest.Response = await supertest(api)
          .put(`/users/123`)
          .set('Authorization', `Bearer ${jwt}`)
          .send({
            username: '404 Username'
          })
          .expect(404);
        expect(response.body).toHaveProperty('error');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('POST /users/:userId/beers', () => {
    it('should send a 404 with an unknown beer', async done => {
      const beerId = '1234';
      try {
        const response: supertest.Response = await supertest(api)
          .post(`/users/${createdUser._id}/beers`)
          .send({
            beerId
          })
          .set('Authorization', `Bearer ${jwt}`)
          .expect(404);
        expect(response.body).toHaveProperty('error');
        done();
      } catch (e) {
        done(e);
      }
    });
    it('should add a beer when it does not exist for the user', async done => {
      // create a beer
      try {
        const userResponse: supertest.Response = await supertest(api)
          .get('/users/me')
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);

        expect(userResponse.body).toHaveProperty('user');

        const beerResponse: supertest.Response = await supertest(api)
          .post('/beers')
          .send({
            name: 'Test Beer'
          })
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);

        expect(beerResponse.body).toHaveProperty('beer');

        const beerId = beerResponse.body.beer._id;
        const addBeerResponse = await supertest(api)
          .post(`/users/${userResponse.body.user._id}/beers`)
          .set('Authorization', `Bearer ${jwt}`)
          .send({
            beer: beerId,
            amount: 1
          });

        expect(addBeerResponse.body).toHaveProperty('user');
        expect(addBeerResponse.body.user.username).toEqual(
          userResponse.body.user.username
        );
        expect(addBeerResponse.body.user).toHaveProperty('owned');
        expect(addBeerResponse.body.user.owned).toHaveLength(1);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should successfully remove the user', async done => {
      try {
        const userResponse: supertest.Response = await supertest(api)
          .get('/users/me')
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);

        expect(userResponse.body).toHaveProperty('user');
        const removeResponse: supertest.Response = await supertest(api)
          .delete(`/users/${userResponse.body.user._id}`)
          .set('Authorization', `Bearer ${jwt}`)
          .expect(204);
        done();
      } catch (e) {
        done(e);
      }
    });
    it('should 404 on unknown :userId', async done => {
      try {
        const response: supertest.Response = await supertest(api)
          .delete(`/users/123`)
          .set('Authorization', `Bearer ${jwt}`)
          .expect(404);
        expect(response.body).toHaveProperty('error');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('post-cleanup', () => {
    it('should return a zero length users array', async done => {
      await OwnedModel.deleteMany({});
      await BeerModel.deleteMany({});
      try {
        const response: supertest.Response = await supertest(api)
          .get('/users')
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200);
        expect(response.body).toHaveProperty('users');
        expect(response.body.users).toHaveLength(0);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
