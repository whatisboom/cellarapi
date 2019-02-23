import { NextFunction } from 'express';
import BreweryModel, { IBreweryModel } from '../models/brewery.model';
import BeerModel, { IBeerModel } from '../models/beer.model';
import { ValidatedResourcesRequest } from '../types';
import { BeerCellarResponse } from '../types/response';

export class BreweriesCtrl {
  public async post(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const brewery: IBreweryModel = await BreweryModel.create(req.body);
      res.data = {
        brewery
      };
      res.status(201);
      next();
    } catch (e) {
      e.status = 404;
      return next(e);
    }
  }

  public async list(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const breweries: IBreweryModel[] = await BreweryModel.find({});
      res.data = {
        breweries
      };
      res.status(200);
      next();
    } catch (e) {
      return next(e);
    }
  }

  public async get(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const brewery: IBreweryModel = req.resources.brewery;
      res.data = {
        brewery
      };
      res.status(200);
      next();
    } catch (e) {
      return next(e);
    }
  }

  public async patch(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      let brewery: IBreweryModel = req.resources.brewery;
      brewery.set(req.body);
      brewery = await brewery.save();
      res.data = {
        brewery
      };
      res.status(202);
      next();
    } catch (e) {
      return next(e);
    }
  }

  public async remove(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const brewery: IBreweryModel = req.resources.brewery;
      await brewery.remove();
      res.status(204);
      next();
    } catch (e) {
      return next(e);
    }
  }

  public async getBeersForBrewery(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const beers: IBeerModel[] = await BeerModel.find({
        brewery: req.resources.brewery._id
      }).populate('brewery');
      res.data = {
        brewery: {
          ...req.resources.brewery.toJSON(),
          beers
        }
      };
      res.status(200);
      next();
    } catch (e) {
      return next(e);
    }
  }
}

export default new BreweriesCtrl();
