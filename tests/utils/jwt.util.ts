import AuthCtrl from '../../src/controllers/auth.ctrl';
import { IUserModel } from '../../src/models/user.model';
import { test_user } from './test-user.util';

export function getValidJwt(user: any = {}): string {
  return AuthCtrl.getJwtForUser(<IUserModel>(<unknown>{
    ...test_user,
    ...user
  }));
}
