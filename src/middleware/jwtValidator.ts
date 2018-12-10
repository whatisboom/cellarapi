import * as jwt from 'express-jwt';
import { Request, RequestHandler, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors';

export function jwtValidator(JWT_SECRET: string): RequestHandler {
  return jwt({
    secret: JWT_SECRET
  }).unless({
    path: ['/', '/auth/signin', '/auth/signup', /^\/loaderio/, '/auth/oauth/untappd']
  });
}

export function jwtErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    if (err.name === 'UnauthorizedError') {
      throw new UnauthorizedError('Invalid JWT');
    }
  } catch (e) {
    next(e);
  }
}
