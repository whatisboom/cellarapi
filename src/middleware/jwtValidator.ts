import * as jwt from 'express-jwt';
import { Request, RequestHandler, Response, NextFunction } from 'express';

export const jwtValidator: RequestHandler = jwt({
  secret: process.env.JWT_SECRET
}).unless({
  path: ['/', '/auth/signin', '/auth/signup']
});

export function jwtErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'invalid-jwt'
    });
  }
  next(err);
}
