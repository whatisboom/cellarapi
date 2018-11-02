import api from '../../../src/api';
import * as supertest from 'supertest';
import UserModel from '../../../src/models/user.model';
import RefreshTokenModel from '../../../src/models/refresh-token.model';
import { getValidJwt, test_user } from '../../utils';

let jwt = getValidJwt();

let refreshToken: string;
describe('Auth Routes', () => {
  describe('POST /auth/signup', () => {
    it('should create a user when given a username, email, and password', done => {
      supertest(api)
        .post('/auth/signup')
        .send(test_user)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body.user.username).toEqual(test_user.username);
          Object.assign(test_user, response.body.user);
          jwt = getValidJwt(test_user);
          done();
        });
    });
  });

  describe('POST /auth/signin', () => {
    it('should return a jwt and a refresh token on login', done => {
      const { username, password } = test_user;
      supertest(api)
        .post('/auth/signin')
        .send({
          username,
          password
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body.token).toBeDefined();
          expect(response.body.refreshToken).toBeDefined();
          refreshToken = response.body.refreshToken;
          done();
        });
    });
  });

  describe('POST /auth/token', () => {
    it('should return a access token', async done => {
      supertest(api)
        .post('/auth/token')
        .send({
          refreshToken
        })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .end(async (err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('token');
          await UserModel.deleteMany({});
          await RefreshTokenModel.deleteMany({});
          done();
        });
    });
  });
});
