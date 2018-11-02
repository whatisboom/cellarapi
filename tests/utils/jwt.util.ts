import AuthCtrl from '../../src/controllers/auth.ctrl';
import { IUserModel } from '../../src/models/user.model';
import * as rand from 'rand-token';

const hash: string = rand.generate(16);
const test_user = {
  _id: 'abcdefghijklmnopqrstuvwx',
  username: `test_user${hash}`,
  password: 'test_password',
  email: `test${hash}@email.com`,
  role: 'admin'
};

export function getValidJwt(user: any = {}): string {
  return AuthCtrl.getJwtForUser(<IUserModel>(<unknown>{
    ...test_user,
    ...user
  }));
}
