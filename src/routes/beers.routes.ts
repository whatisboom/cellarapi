import { Router } from 'express';
import BeersCtrl from '../controllers/beers.ctrl';
import { requireRolePermission } from '../middleware';

export default function beersRoutes(api: Router): void {
  api
    .route('/beers')
    .get(requireRolePermission('beers', 'read'), BeersCtrl.list)
    .post(requireRolePermission('beers', 'create'), BeersCtrl.post);

  api
    .route('/beers/:beerId')
    .get(requireRolePermission('beers', 'read'), BeersCtrl.get)
    .put(requireRolePermission('beers', 'update'), BeersCtrl.put)
    .delete(requireRolePermission('beers', 'delete'), BeersCtrl.remove);
}
