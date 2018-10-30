import * as jwt from 'express-jwt';
import { Request, Response, NextFunction } from 'express';

export const jwtValidator = jwt({
  secret: process.env.JWT_SECRET
}).unless({
  path: [
    /auth\/?.*/ // all auth routes
  ]
});

export function jwtErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'invalid-jwt'
    });
  }
  next(err);
}
