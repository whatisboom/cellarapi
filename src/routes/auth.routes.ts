import { Router } from 'express';
import AuthCtrl from '../controllers/auth.ctrl';
import { requireRolePermission } from '../middleware';

export default function(api: Router) {
  api.route('/auth/signup')
    .post(AuthCtrl.signup)
  api.route('/auth/signin')
    .post(AuthCtrl.signin);
}