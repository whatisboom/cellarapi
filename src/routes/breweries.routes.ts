import { Router } from 'express';
import BreweriesCtrl from '../controllers/breweries.ctrl';

export default function breweriesRoutes(api: Router) {
  api
    .route('/breweries')
    .get(BreweriesCtrl.list)
    .post(BreweriesCtrl.post);

  api.route('/breweries/:breweryId')
    .get(BreweriesCtrl.get)
    .put(BreweriesCtrl.put)
    .delete(BreweriesCtrl.remove);
}
