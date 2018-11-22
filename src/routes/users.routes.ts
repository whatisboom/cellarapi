import { Router } from 'express';
import UsersCtrl from '../controllers/users.ctrl';
import InventoryCtrl from '../controllers/inventory.ctrl';
import { validateResources } from '../middleware';

import {
  stripFieldsExceptForRoles,
  allowOwnProfile,
  requireRolePermission
} from '../middleware';

export default function usersRoutes(api: Router): void {
  api
    .route('/users')
    .get(requireRolePermission('users', 'read'), UsersCtrl.list);

  api
    .route('/users/me')
    .get(requireRolePermission('users', 'read'), UsersCtrl.getOwnProfile);

  api
    .route('/users/:userId')
    .get(
      validateResources,
      requireRolePermission('users', 'read'),
      UsersCtrl.get
    )
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
    .route('/users/:userId/beers')
    .get(
      validateResources,
      requireRolePermission('users', 'read'),
      InventoryCtrl.getUsersBeers
    );
  api
    .route('/users/:userId/beers/:beerId')
    .post(
      validateResources,
      requireRolePermission('users', 'update'),
      allowOwnProfile,
      InventoryCtrl.addBeerToUser
    )
    .patch(
      validateResources,
      requireRolePermission('users', 'update'),
      allowOwnProfile,
      InventoryCtrl.updateBeerQuantity
    );
}
