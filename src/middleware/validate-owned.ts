import { Response, NextFunction } from 'express';
import { OwnedModel } from '../models/quantity.model';
import { ValidatedResourcesRequest } from '../types';
import { ApiError } from '../errors';

export async function validateOwned(
  req: ValidatedResourcesRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    req.resources = req.resources || {};
    const { quantityId } = req.params;
    const owned = await OwnedModel.findById(quantityId)
      .populate('beer')
      .exec();
    if (owned === null) {
      next(new ApiError(`Inventory not found with id: ${quantityId}`, 404));
    }
    req.resources.owned = owned;
    next();
  } catch (e) {
    next(e);
  }
}
