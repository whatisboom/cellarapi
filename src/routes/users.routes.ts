import { Router } from "express";
import UsersCtrl from "../controllers/users.ctrl";

export default function usersRoutes(api: Router) {
  api
    .route("/users")
    .get(UsersCtrl.list)
    .post(UsersCtrl.post);

  api
    .route("/users/:userId")
    .get(UsersCtrl.get)
    .put(UsersCtrl.put)
    .delete(UsersCtrl.remove);
    
  api.route("/users/:userId/beers")
    .post(UsersCtrl.addBeer)
}
