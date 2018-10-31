import api from '../../../src/api';
import * as supertest from 'supertest';
import * as rand from 'rand-token';
import { IUserModel } from '../../../src/models/user.model';
import AuthCtrl from '../../../src/controllers/auth.ctrl';

const hash = rand.generate(16);
let test_user = {
  _id: '',
  username: `test_user${hash}`,
  password: 'test_password',
  email: `test${hash}@email.com`,
  role: 'user'
};

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
          test_user._id = response.body.user._id;
          done();
        });
    });
  });

  describe('POST /auth/signin', () => {
    it('should return a jwt and a refresh token on login', done => {
      supertest(api)
        .post('/auth/signin')
        .send({
          username: test_user.username,
          password: test_user.password
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
    it('should return a access token', done => {
      const jwt: string = AuthCtrl.getJwtForUser(<IUserModel>(
        (<unknown>test_user)
      ));
      supertest(api)
        .post('/auth/token')
        .send({
          refreshToken
        })
        .set('Authorization', `Bearer ${jwt}`)
        .end((err: Error, res: supertest.Response) => {
          if (err) done(err);
          expect(res.status).toEqual(200);
          expect(res.body.token).toBeDefined();
          done();
        });
    });
  });
});
