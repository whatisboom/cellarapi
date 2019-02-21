import { Response, NextFunction } from 'express';
import UserModel from '../models/user.model';
import BeerModel from '../models/beer.model';
import BreweryModel from '../models/brewery.model';
import { ValidatedResourcesRequest, IUser, IBeer, IBrewery } from '../types';
import { ApiError } from '../errors';

export const modelMap: { [key: string]: any /* TODO: I<Resource>Model */ } = {
  user: async (username: string): Promise<IUser> =>
    await UserModel.findOne({
      username
    }),
  beer: async (untappdId: number): Promise<IBeer> =>
    await BeerModel.findOne({
      untappdId
    }),
  brewery: async (slug: string): Promise<IBrewery> =>
    await BreweryModel.findOne({
      slug
    })
};
// currently will throw error on the first resource that fails
// casting mongoose CastErrors (for invalid id's) to 404
export async function validateResources(
  req: ValidatedResourcesRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    req.resources = {};
    const params: string[] = Object.keys(req.params);
    const resources = params.map((key: string) => {
      return new Promise(async (resolve, reject) => {
        try {
          const findDocument = modelMap[key];
          const value = req.params[key];
          const item = await findDocument(value);
          if (item === null && key === 'user') {
            reject(new ApiError(`${key}: not found`, 404));
          }
          resolve({ key, item });
        } catch (e) {
          reject(e);
        }
      });
    });
    const resolvedResources = await Promise.all(resources);
    resolvedResources.forEach(({ key, item }) => {
      req.resources[key] = item;
    });
    return next();
  } catch (e) {
    return next(e);
  }
}
