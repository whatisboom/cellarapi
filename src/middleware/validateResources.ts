import { Response, NextFunction } from 'express';
import UserModel from '../models/user.model';
import BeerModel from '../models/beer.model';
import BreweryModel from '../models/brewery.model';
import { IValidResource, ValidatedResourcesRequest } from '../types';

export const modelMap: { [key: string]: any /* TODO: I<Resource>Model */ } = {
  beerId: BeerModel,
  breweryId: BreweryModel,
  userId: UserModel
};
// currently will throw error on the first resource that fails
// casting mongoose CastErrors (for invalid id's) to 404
export async function validateResources(
  req: ValidatedResourcesRequest,
  res: Response,
  next: NextFunction
) {
  try {
    req.resources = {};
    const params: string[] = Object.keys(req.params);
    const resources = params.map((key: string) => {
      return new Promise(async (resolve, reject) => {
        const model = modelMap[key];
        let item;
        try {
          item = await model.findById(req.params[key]);
        } catch (e) {
          if (e.name === 'CastError') {
            e.status = 404;
          }
          return next(e);
        }
        if (item === null) {
          reject({ [key]: 'not-found' });
        } else {
          resolve({
            key,
            item
          });
        }
      });
    });
    const resolvedResources = await Promise.all(resources);
    resolvedResources.forEach(({ key, item }) => {
      req.resources[key.substring(0, key.length - 2)] = item;
    });
    return next();
  } catch (e) {
    return next(e);
  }
}
