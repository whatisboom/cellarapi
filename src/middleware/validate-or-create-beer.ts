import { Response, NextFunction } from 'express';
import BeerModel, { IBeerModel } from '../models/beer.model';
import { ValidatedResourcesRequest } from '../types';
import { Untappd } from '../utils';
import BreweryModel, { IBreweryModel } from '../models/brewery.model';

export async function validateOrCreateBeerByUntappdId(
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
      beer.brewery = await BreweryModel.findOne({
        untappdId: beer.brewery.untappdId
      });
      beer = new BeerModel(beer);
      beer = await beer.save();
    }
    req.resources.beer = beer;
    next();
  } catch (e) {
    next(e);
  }
}

export async function validateOrCreateBeerBySlug(
  req: ValidatedResourcesRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.resources = req.resources || {};
  try {
    let beer = await BeerModel.findOne({
      slug: req.params.beer
    });
    if (beer === null && req.user.untappdApiKey) {
      throw new Error(`404 beer not found: ${req.params.beer}`);
    }
    req.resources.beer = beer;
    next();
  } catch (e) {
    next(e);
  }
}
