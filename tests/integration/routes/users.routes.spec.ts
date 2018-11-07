import api from '../../../src/api';
import * as supertest from 'supertest';
import { getValidJwt } from '../../utils';
import { OwnedModel } from '../../../src/models/quantity.model';
import BeerModel from '../../../src/models/beer.model';
import UserModel from '../../../src/models/user.model';

let jwt: string = getValidJwt();
let createdUser: any = {};

describe('Users Routes', () => {
  describe('Setup: Create user', () => {
    it('should create a user', async done => {
      try {
        const response: supertest.Response = await supertest(api)
          .post('/auth/signup')
          .send({
            username: 'users-testuser',
            email: 'users@testemail.com',
            password: 'testpassword'
          })
          .expect(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.username).toEqual('users-testuser');
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
    it('should 401 when a user attempts to delete unknown :userId', async done => {
      try {
        const response: supertest.Response = await supertest(api)
          .put(`/users/abcdefghijklmnopqrstuvwx`)
          .set('Authorization', `Bearer ${jwt}`)
          .send({
            username: '404 Username'
          })
          .expect(401);
        expect(response.body).toHaveProperty('error');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should 401 when a user attempts to delete themselves', async done => {
      try {
        const removeResponse: supertest.Response = await supertest(api)
          .delete(`/users/${createdUser._id}`)
          .set('Authorization', `Bearer ${jwt}`)
          .expect(401);
        done();
      } catch (e) {
        done(e);
      }
    });
    it('should 401 when a user attempts to delete unknown :userId', async done => {
      try {
        const response: supertest.Response = await supertest(api)
          .delete(`/users/abcdefghijklmnopqrstuvwx`)
          .set('Authorization', `Bearer ${jwt}`)
          .expect(401);
        expect(response.body).toHaveProperty('error');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('post-cleanup', () => {
    it('should return a zero length users array', async done => {
      try {
        await OwnedModel.deleteMany({});
        await BeerModel.deleteMany({});
        await UserModel.deleteMany({});
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
