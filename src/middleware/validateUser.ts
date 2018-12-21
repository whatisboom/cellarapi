import { Response, NextFunction } from 'express';
import UserModel from '../models/user.model';
import { ValidatedResourcesRequest } from '../types';

export async function validateUser(
  req: ValidatedResourcesRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.resources = req.resources || {};
  const username = req.params.user;
  try {
    const user = await UserModel.findOne({
      username
    });
    if (user === null) {
      throw new Error(`404 user (${username}) not found`);
    }
    req.resources.user = user;
    next();
  } catch (e) {
    next(e);
  }
}
