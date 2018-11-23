import { Router } from 'express';
import BeersCtrl from '../controllers/beers.ctrl';
import { requireRolePermission, validateResources } from '../middleware';

export default function beersRoutes(api: Router): void {
  api
    .route('/beers')
    .get(requireRolePermission('beers', 'read'), BeersCtrl.list)
    .post(requireRolePermission('beers', 'create'), BeersCtrl.post);

  api
    .route('/beers/:beer')
    .get(
      validateResources,
      requireRolePermission('beers', 'read'),
      BeersCtrl.get
    )
    .patch(
      validateResources,
      requireRolePermission('beers', 'update'),
      BeersCtrl.patch
    )
    .delete(
      validateResources,
      requireRolePermission('beers', 'delete'),
      BeersCtrl.remove
    );
}
