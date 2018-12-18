import { Response, NextFunction } from 'express';
import BeerModel, { IBeerModel } from '../models/beer.model';
import BreweryModel, { IBreweryModel } from '../models/brewery.model';
import { ValidatedResourcesRequest } from '../types';
import { Untappd } from '../utils';

export async function validateOrCreateBrewery(
  req: ValidatedResourcesRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.resources = req.resources || {};
  const beerUid: number = parseInt(req.params.beer, 10);
  try {
    let beer = await BeerModel.findOne({
      untappdId: beerUid
    });
    let brewery;
    if (beer === null) {
      const untappd = new Untappd(req.user.untappdApiKey);
      beer = <IBeerModel>await untappd.getBeerInfo(beerUid);
      beer.brewery = <IBreweryModel>beer.brewery;
      brewery = await BreweryModel.findOne({
        untappdId: beer.brewery.untappdId
      });
      if (brewery === null) {
        brewery = await new BreweryModel(beer.brewery).save();
      }
    }
    req.resources.brewery = brewery;
    next();
  } catch (e) {
    next(e);
  }
}
