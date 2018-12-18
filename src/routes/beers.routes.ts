import { Router } from 'express';
import BeersCtrl from '../controllers/beers.ctrl';
import {
  requireRolePermission,
  validateOrCreateBeer,
  validateOrCreateBrewery,
  populateFullUser
} from '../middleware';

export default function beersRoutes(api: Router): void {
  api
    .route('/beers')
    .get(requireRolePermission('beers', 'read'), BeersCtrl.list)
    .post(requireRolePermission('beers', 'create'), BeersCtrl.post);

  api
    .route('/beers/:beer')
    .get(
      populateFullUser,
      validateOrCreateBrewery,
      validateOrCreateBeer,
      requireRolePermission('beers', 'read'),
      BeersCtrl.get
    )
    .patch(
      populateFullUser,
      validateOrCreateBeer,
      requireRolePermission('beers', 'update'),
      BeersCtrl.patch
    )
    .delete(
      populateFullUser,
      validateOrCreateBeer,
      requireRolePermission('beers', 'delete'),
      BeersCtrl.remove
    );
}
