import {
  Request,
  Response,
  NextFunction
} from 'express';

import {
  ApiError
} from '../types';

export function allowOwnProfile(e: ApiError, req: Request, res:Response, next: NextFunction) {
  if (
    req.method === 'PUT' &&
    req.route.path === '/users/:userId' &&
    req.params.userId === req.user._id
  ) {
    return next();
  }
  return next(e);
}