import { Router } from 'express';
import AuthCtrl from '../controllers/auth.ctrl';

export default function(api: Router): void {
  api.route('/auth/token').post(AuthCtrl.getAccessToken);
  api.route('/auth/oauth/untappd').post(AuthCtrl.oauth);
}
