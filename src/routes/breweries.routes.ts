import { Router } from 'express';
import BreweriesCtrl from '../controllers/breweries.ctrl';
import { requireRolePermission, validateResources } from '../middleware';

export default function breweriesRoutes(api: Router): void {
  api
    .route('/breweries')
    .get(requireRolePermission('breweries', 'read'), BreweriesCtrl.list)
    .post(requireRolePermission('breweries', 'create'), BreweriesCtrl.post);

  api
    .route('/breweries/:breweryId')
    .get(
      validateResources,
      requireRolePermission('breweries', 'read'),
      BreweriesCtrl.get
    )
    .put(
      validateResources,
      requireRolePermission('breweries', 'update'),
      BreweriesCtrl.put
    )
    .delete(
      validateResources,
      requireRolePermission('breweries', 'delete'),
      BreweriesCtrl.remove
    );

  api
    .route('/breweries/:breweryId/beers')
    .get(
      validateResources,
      requireRolePermission('beers', 'read'),
      BreweriesCtrl.getBeersForBrewery
    );
}
