import { Router } from 'express';
import BeersCtrl from '../controllers/beers.ctrl';
import {
  requireRolePermission,
  validateOrCreateBeerBySlug,
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
      validateOrCreateBeerBySlug,
      requireRolePermission('beers', 'read'),
      BeersCtrl.get
    )
    .patch(
      populateFullUser,
      validateOrCreateBeerBySlug,
      requireRolePermission('beers', 'update'),
      BeersCtrl.patch
    )
    .delete(
      populateFullUser,
      validateOrCreateBeerBySlug,
      requireRolePermission('beers', 'delete'),
      BeersCtrl.remove
    );
}
