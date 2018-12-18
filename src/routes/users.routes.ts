import { Router } from 'express';
import UsersCtrl from '../controllers/users.ctrl';
import InventoryCtrl from '../controllers/inventory.ctrl';
import { validateResources, populateFullUser } from '../middleware';

import {
  stripFieldsExceptForRoles,
  allowOwnProfile,
  requireRolePermission
} from '../middleware';
import { validateUser } from '../middleware/validateUser';

export default function usersRoutes(api: Router): void {
  api
    .route('/users')
    .get(requireRolePermission('users', 'read'), UsersCtrl.list);

  api
    .route('/users/me')
    .get(requireRolePermission('users', 'read'), UsersCtrl.getOwnProfile);

  api
    .route('/users/:user')
    .get(validateUser, requireRolePermission('users', 'read'), UsersCtrl.get)
    .patch(
      validateResources,
      requireRolePermission('users', 'update'),
      stripFieldsExceptForRoles(['role'], ['admin']),
      allowOwnProfile,
      UsersCtrl.patch
    )
    .delete(
      validateResources,
      requireRolePermission('users', 'delete'),
      UsersCtrl.remove
    );

  api
    .route('/users/:user/beers')
    .get(
      validateResources,
      requireRolePermission('users', 'read'),
      InventoryCtrl.getUsersBeers
    );
  api
    .route('/users/:user/beers/:beer')
    .post(
      validateResources,
      requireRolePermission('users', 'update'),
      allowOwnProfile,
      populateFullUser,
      InventoryCtrl.addBeerToUser
    )
    .patch(
      validateResources,
      requireRolePermission('users', 'update'),
      allowOwnProfile,
      InventoryCtrl.updateBeerQuantity
    );
}
