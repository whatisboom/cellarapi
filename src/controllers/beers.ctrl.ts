import { NextFunction } from 'express';
import BeerModel, { IBeerModel } from '../models/beer.model';
import { ValidatedResourcesRequest } from '../types';
import { BeerCellarResponse } from '../types/response';

export class BeersCtrl {
  public async post(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = await BeerModel.create(req.body);
      res.data = {
        beer
      };
      res.status(201);
      next();
    } catch (e) {
      next(e);
    }
  }

  public async list(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const beers: IBeerModel[] = await BeerModel.find({});
      res.data = {
        beers
      };
      next();
    } catch (e) {
      next(e);
    }
  }

  public async get(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = req.resources.beer;
      await beer.populate('brewery').execPopulate();
      res.data = {
        beer
      };
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
      let beer: IBeerModel = req.resources.beer;
      beer.set(req.body);
      beer = await beer.save();
      res.data = {
        beer
      };
      res.status(202);
      next();
    } catch (e) {
      next(e);
    }
  }

  public async remove(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = req.resources.beer;
      await beer.remove();
      res.status(204);
      next();
    } catch (e) {
      next(e);
    }
  }
}

export default new BeersCtrl();
