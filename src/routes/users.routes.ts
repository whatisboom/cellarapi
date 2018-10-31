import { Router } from 'express';
import UsersCtrl from '../controllers/users.ctrl';
import { requireRolePermission, allowOwnProfile } from '../middleware';

export default function usersRoutes(api: Router) {
  api
    .route('/users')
    .get(requireRolePermission('users', 'read'), UsersCtrl.list);

  api
    .route('/users/me')
    .get(requireRolePermission('users', 'read'), UsersCtrl.getOwnProfile);

  api
    .route('/users/:userId')
    .get(requireRolePermission('users', 'read'), UsersCtrl.get)
    .put(
      requireRolePermission('users', 'update'),
      allowOwnProfile,
      UsersCtrl.put
    )
    .delete(requireRolePermission('users', 'delete'), UsersCtrl.remove);

  api
    .route('/users/:userId/beers')
    .post(
      requireRolePermission('users', 'update'),
      allowOwnProfile,
      UsersCtrl.addBeerToOwned
    );
}
