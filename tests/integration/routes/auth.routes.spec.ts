import api from '../../../src/api';
import * as supertest from 'supertest';
import UserModel from '../../../src/models/user.model';
import RefreshTokenModel from '../../../src/models/refresh-token.model';
import { getValidJwt } from '../../utils';

let jwt = getValidJwt();

let refreshToken: string;
let createdUser: any;

describe('Auth Routes', () => {
  describe('POST /auth/signup', () => {
    it('should create a user when given a username, email, and password', done => {
      supertest(api)
        .post('/auth/signup')
        .send({
          username: 'authtestuser',
          password: 'testpassword',
          email: 'auth@testemail.com'
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body.user.username).toEqual('authtestuser');
          createdUser = response.body.user;
          jwt = getValidJwt(createdUser);
          done();
        });
    });
  });

  describe('POST /auth/signin', () => {
    it('should return a jwt and a refresh token on login', done => {
      const { username } = createdUser;
      supertest(api)
        .post('/auth/signin')
        .send({
          username,
          password: 'testpassword'
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
