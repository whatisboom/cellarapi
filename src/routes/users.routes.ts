import { Router } from "express";
import UsersCtrl from "../controllers/users.ctrl";
import { requireRolePermission } from '../middleware';

export default function usersRoutes(api: Router) {
  api
    .route("/users")
    .get(requireRolePermission('users', 'read'), UsersCtrl.list)
    .post(requireRolePermission('users', 'create'), UsersCtrl.post);

  api
    .route("/users/:userId")
    .get(requireRolePermission('users', 'read'), UsersCtrl.get)
    .put(requireRolePermission('users', 'update'), UsersCtrl.put)
    .delete(requireRolePermission('users', 'delete'), UsersCtrl.remove);
    
  api.route("/users/:userId/beers")
    .post(requireRolePermission('users', 'create'), UsersCtrl.addBeer);
}
