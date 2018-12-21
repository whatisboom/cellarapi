import { Router } from 'express';
import { requireRolePermission, populateFullUser } from '../middleware';
import SearchCtrl from '../controllers/search.ctrl';

export default function searchRoutes(api: Router): void {
  api
    .route('/search/beers')
    .get(
      requireRolePermission('beers', 'read'),
      populateFullUser,
      SearchCtrl.beer
    );
}
