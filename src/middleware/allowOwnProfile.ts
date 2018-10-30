import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../errors';

export function allowOwnProfile(
  e: ApiError,
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
