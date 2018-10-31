import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../errors';

export function stripFieldsExceptForRoles(fields: string[], roles: string[]) {
  function middleware(
    e: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (roles.indexOf(req.user.role) === -1) {
      fields.forEach((field: string) => {
        delete req.body[field];
      });
    }
    return next(e);
  }
  return middleware;
}
