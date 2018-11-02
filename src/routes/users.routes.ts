import { Router } from 'express';
import UsersCtrl from '../controllers/users.ctrl';
import {
  stripFieldsExceptForRoles,
  allowOwnProfile,
  requireRolePermission
} from '../middleware';

export default function usersRoutes(api: Router): void {
  api
    .route('/users')
    .get(requireRolePermission('users', 'read'), UsersCtrl.list)
    .post(requireRolePermission('users', 'create'), UsersCtrl.post);

  api
    .route('/users/me')
    .get(requireRolePermission('users', 'read'), UsersCtrl.getOwnProfile);

  api
    .route('/users/:userId')
    .get(requireRolePermission('users', 'read'), UsersCtrl.get)
    .put(
      requireRolePermission('users', 'update'),
      stripFieldsExceptForRoles(['role'], ['admin']),
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
