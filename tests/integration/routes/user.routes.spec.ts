import api from '../../../src/api';
import * as supertest from 'supertest';
import AuthCtrl from '../../../src/controllers/auth.ctrl';
import { IUserModel } from '../../../src/models/user.model';
import * as rand from 'rand-token';

const hash: string = rand.generate(16);
const test_user = {
  username: `test_user${hash}`,
  password: 'test_password',
  email: `test${hash}@email.com`,
  role: 'user'
};

let user: IUserModel;
let jwt: string = AuthCtrl.getJwtForUser(<IUserModel>(<unknown>{
  ...test_user,
  _id: 'abcdefghijklmnopqrstuvwx'
}));

describe('GET /users', () => {
  it('should list users', done => {
    supertest(api)
      .get('/users')
      .set('Authorization', `Bearer ${jwt}`)
      .end((err: Error, res: supertest.Response) => {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(res.body.users.length).toBeGreaterThan(0);
        user = res.body.users[0];
        done();
      });
  });
});

describe('GET /users/:userID', () => {
  it('should return a single user', done => {
    jwt = AuthCtrl.getJwtForUser(user);
    supertest(api)
      .get(`/users/${user._id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .end((err: Error, res: supertest.Response) => {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(res.body.user.username).toEqual(user.username);
        done();
      });
  });
});

describe('GET /users/me', () => {
  it('should return a single user', done => {
    jwt = AuthCtrl.getJwtForUser(user);
    supertest(api)
      .get('/users/me')
      .set('Authorization', `Bearer ${jwt}`)
      .end((err: Error, res: supertest.Response) => {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(res.body.user.username).toEqual(user.username);
        done();
      });
  });
});
