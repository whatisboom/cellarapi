import { Router } from 'express';
import BreweriesCtrl from '../controllers/breweries.ctrl';
import { requireRolePermission, validateResources } from '../middleware';

export default function breweriesRoutes(api: Router): void {
  api
    .route('/breweries')
    .get(requireRolePermission('breweries', 'read'), BreweriesCtrl.list)
    .post(requireRolePermission('breweries', 'create'), BreweriesCtrl.post);

  api
    .route('/breweries/:brewery')
    .get(
      validateResources,
      requireRolePermission('breweries', 'read'),
      BreweriesCtrl.get
    )
    .patch(
      validateResources,
      requireRolePermission('breweries', 'update'),
      BreweriesCtrl.patch
    )
    .delete(
      validateResources,
      requireRolePermission('breweries', 'delete'),
      BreweriesCtrl.remove
    );

  api
    .route('/breweries/:brewery/beers')
    .get(
      validateResources,
      requireRolePermission('beers', 'read'),
      BreweriesCtrl.getBeersForBrewery
    );
}
