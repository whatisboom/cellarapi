import * as supertest from 'supertest';
import AuthCtrl from '../../../src/controllers/auth.ctrl';
import { IUserModel } from '../../../src/models/user.model';
import * as rand from 'rand-token';
const request = supertest('http://localhost:8000');

const hash: string = rand.generate(16);
const test_user = {
  username: `test_user${hash}`,
  password: 'test_password',
  email: `test${hash}@email.com`,
  role: 'user'
};

let user: IUserModel;
const jwt: string = AuthCtrl.getJwtForUser(<IUserModel>(<unknown>{
  ...test_user,
  _id: 'abcdefghijklmnopqrstuvwx'
}));

describe('GET /users', () => {
  it('should list users', done => {
    request
      .get('/users')
      .set('Authorization', `Bearer ${jwt}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(200);
        expect(res.body.users.length).toBeGreaterThan(0);
        user = res.body.users[0];
        done();
      });
  });
});

describe('GET /users/:userID', () => {
  it('should return a single user', done => {
    request
      .get(`/users/${user._id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(200);
        expect(res.body.user.username).toEqual(user.username);
        done();
      });
  });
});
