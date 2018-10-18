import { Router } from "express";
import BeersCtrl from "../controllers/beers.ctrl";

export default function beersRoutes(api: Router) {
  api
    .route("/beers")
    .get(BeersCtrl.list)
    .post(BeersCtrl.post);

  api
    .route("/beers/:beerId")
    .get(BeersCtrl.get)
    .put(BeersCtrl.put)
    .delete(BeersCtrl.remove);
}
