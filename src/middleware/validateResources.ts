import { Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import UserModel from '../models/user.model';
import BeerModel from '../models/beer.model';
import BreweryModel from '../models/brewery.model';
import { ValidatedResourcesRequest } from '../types';

export const modelMap: { [key: string]: any /* TODO: I<Resource>Model */ } = {
  user: async (username: string) =>
    await UserModel.findOne({
      username
    }),
  beer: async (name: string) =>
    await BeerModel.findOne({
      name
    }),
  brewery: async (name: string) =>
    await BreweryModel.findOne({
      name
    })
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
        try {
          const model = modelMap[key];
          const value = req.params[key];
          const item = await model(value);
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
    console.log(e);
    return next(e);
  }
}
