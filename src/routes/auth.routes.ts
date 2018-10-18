import { Router } from 'express';
import AuthCtrl from '../controllers/auth.ctrl';

export default function(api: Router) {
  api.route('/auth')
    .post(AuthCtrl.post);
}