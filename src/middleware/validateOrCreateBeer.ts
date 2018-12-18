import { Response, NextFunction } from 'express';
import BeerModel, { IBeerModel } from '../models/beer.model';
import { ValidatedResourcesRequest } from '../types';
import { Untappd } from '../utils';
import { IBreweryModel } from '../models/brewery.model';

export async function validateOrCreateBeer(
  req: ValidatedResourcesRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.resources = req.resources || {};
  const untappdId: number = parseInt(req.params.beer, 10);
  try {
    let beer = await BeerModel.findOne({
      untappdId
    });
    if (beer === null && req.user.untappdApiKey) {
      const untappd = new Untappd(req.user.untappdApiKey);
      beer = <IBeerModel>await untappd.getBeerInfo(untappdId);
      beer.brewery = <IBreweryModel>beer.brewery;
      beer.brewery = beer.brewery._id;
      beer = new BeerModel(beer);
      beer = await beer.save();
    }
    req.resources.beer = beer;
    next();
  } catch (e) {
    next(e);
  }
}
