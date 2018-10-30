import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError } from '../errors';
import { IPermissionsMap, IUser } from '../types';

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

export function userHasPermission(
  user: IUser,
  permission: string,
  resource: string
) {
  return permissions[user.role][resource].indexOf(permission) !== -1;
}

export function requireRolePermission(resource: string, permission: string) {
  function checkPermissions(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    if (!user) {
      const e: UnauthorizedError = new UnauthorizedError();
      e.status = 401;
      return next(e);
    } else if (userHasPermission(user, permission, resource)) {
      return next();
    } else {
      const e: UnauthorizedError = new UnauthorizedError();
      e.status = 401;
      return next(e);
    }
  }
  return checkPermissions;
}
