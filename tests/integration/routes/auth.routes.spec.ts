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
const request = supertest('http://localhost:8000');
let refreshToken: string;
describe('Auth Routes', () => {
  describe('POST /auth/signup', () => {
    it('should create a user when given a username, email, and password', done => {
      request
        .post('/auth/signup')
        .send(test_user)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, response) => {
          if (err) done(err);
          expect(response.body.user.username).toEqual(test_user.username);
          test_user._id = response.body.user._id;
          done();
        });
    });
  });

  describe('POST /auth/signin', () => {
    it('should return a jwt and a refresh token on login', done => {
      request
        .post('/auth/signin')
        .send({
          username: test_user.username,
          password: test_user.password
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, response) => {
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
      request
        .post('/auth/token')
        .send({
          refreshToken
        })
        .set('Authorization', `Bearer ${jwt}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(200);
          expect(res.body.token).toBeDefined();
          done();
        });
    });
  });
});
