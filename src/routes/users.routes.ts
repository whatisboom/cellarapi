import { Router } from 'express';
import UsersCtrl from '../controllers/users.ctrl';
import InventoryCtrl from '../controllers/inventory.ctrl';
import {
  populateFullUser,
  validateOrCreateBrewery,
  validateOrCreateBeerByUntappdId,
  validateOwned
} from '../middleware';

import {
  stripFieldsExceptForRoles,
  allowOwnProfile,
  requireRolePermission,
  validateUser
} from '../middleware';

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
      validateUser,
      requireRolePermission('users', 'update'),
      stripFieldsExceptForRoles(['role'], ['admin']),
      allowOwnProfile,
      UsersCtrl.patch
    )
    .delete(
      validateUser,
      requireRolePermission('users', 'delete'),
      UsersCtrl.remove
    );

  api
    .route('/users/:user/beers')
    .get(
      validateUser,
      requireRolePermission('users', 'read'),
      InventoryCtrl.getUsersBeers
    );
  api
    .route('/users/:user/beers/:beer')
    .post(
      populateFullUser,
      validateUser,
      validateOrCreateBrewery,
      validateOrCreateBeerByUntappdId,
      requireRolePermission('users', 'update'),
      allowOwnProfile,
      populateFullUser,
      InventoryCtrl.addBeerToUser
    );

  api
    .route('/inventory/:quantityId')
    .patch(
      validateOwned,
      requireRolePermission('users', 'update'),
      allowOwnProfile,
      InventoryCtrl.updateBeerQuantity
    )
    .delete(
      validateOwned,
      requireRolePermission('users', 'update'),
      allowOwnProfile,
      InventoryCtrl.deleteOwnedBeer
    );
}
