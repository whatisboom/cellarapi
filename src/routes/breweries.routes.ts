import { Router } from 'express';
import BreweriesCtrl from '../controllers/breweries.ctrl';
import { requireRolePermission } from '../middleware';

export default function breweriesRoutes(api: Router): void {
  api
    .route('/breweries')
    .get(requireRolePermission('breweries', 'read'), BreweriesCtrl.list)
    .post(requireRolePermission('breweries', 'create'), BreweriesCtrl.post);

  api
    .route('/breweries/:breweryId')
    .get(requireRolePermission('breweries', 'read'), BreweriesCtrl.get)
    .put(requireRolePermission('breweries', 'update'), BreweriesCtrl.put)
    .delete(requireRolePermission('breweries', 'delete'), BreweriesCtrl.remove);

  api
    .route('/breweries/:breweryId/beers')
    .get(
      requireRolePermission('beers', 'read'),
      BreweriesCtrl.getBeersForBrewery
    );
}
