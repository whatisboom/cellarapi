import { Response, NextFunction } from 'express';
import { OwnedModel } from '../models/quantity.model';
import { ValidatedResourcesRequest } from '../types';

export async function validateOwned(
  req: ValidatedResourcesRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    req.resources = req.resources || {};
    const { quantityId } = req.params;
    const owned = await OwnedModel.findById(quantityId);
    if (owned === null) {
      throw new Error(`404 owned not found`);
    }
    req.resources.owned = owned;
    next();
  } catch (e) {
    next(e);
  }
}
