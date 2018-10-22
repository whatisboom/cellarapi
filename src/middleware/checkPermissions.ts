import {
  Request,
  Response,
  NextFunction
} from 'express';

import {
  IPermissionsMap,
  IUser
} from '../types';

export const permissions: IPermissionsMap = {
  admin: {
    users: ['create', 'read', 'update', 'delete'],
    beers: ['create', 'read', 'update', 'delete'],
    breweries: ['create', 'read', 'update', 'delete']
  },
  moderator: {
    users: ['create', 'read', 'update', 'delete'],
    beers: ['create', 'read', 'update', 'delete'],
    breweries: ['create', 'read', 'update', 'delete']
  },
  user: {
    users: ['read'],
    beers: ['create', 'read'],
    breweries: ['create', 'read']
  }
};

export function userHasPermission(user: IUser, permission: string, resource: string) {
  return permissions[user.role][resource].indexOf(permission) !== -1;
}

export function requireRolePermission(resource: string, permission: string) {
  function checkPermissions(req: Request, res: Response, next: NextFunction) {
    const {
      user
    } = req;
    if (!user) {
      next(new Error('error: user not found'));
    } else if (
      userEditingOwn(req, user) ||
      userHasPermission(user, permission, resource)
    ) {
      next();
    } else {
      next(new Error('user-unauthorized'));
    }
  }
  return checkPermissions
}

export function userEditingOwn(req: Request, user: IUser) {
  if (
    req.method === 'PUT' &&
    req.route.path === '/users/:userId' &&
    req.params.userId === user._id
  ) {
    return true;
  }
  return false;
}