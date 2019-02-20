import { Request, NextFunction } from 'express';
import { BeerCellarResponse } from '../types/response';

export function sendSuccess(
  req: Request,
  res: BeerCellarResponse,
  next: NextFunction
) {
  if (!res.headersSent) {
    res.send({
      ...res.data,
      statusCode: res.statusCode
    });
  }
  next();
}
