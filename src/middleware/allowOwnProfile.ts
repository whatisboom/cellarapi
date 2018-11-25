import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError } from '../errors';

export function allowOwnProfile(
  e: UnauthorizedError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userResourcePattern = /^\/users/;
  if (
    userResourcePattern.test(req.route.path) &&
    req.params.userId === req.user._id
  ) {
    return next();
  }
  return next(e);
}
