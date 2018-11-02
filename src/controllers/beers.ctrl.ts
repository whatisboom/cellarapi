import { Request, Response, NextFunction } from 'express';
import BeerModel, { IBeerModel } from '../models/beer.model';
import { ApiError } from '../errors';

export class BeersCtrl {
  public async post(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = await BeerModel.create(req.body);
      res.json({
        beer
      });
    } catch (e) {
      next(e);
    }
  }

  public async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beers: IBeerModel[] = await BeerModel.find({});
      res.json({
        beers
      });
    } catch (e) {
      next(e);
    }
  }

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = await BeerModel.findOne({
        _id: req.params.beerId
      })
        .populate('brewery')
        .exec();
      if (beer === null) {
        const e = new ApiError('not-found');
        e.status = 404;
        throw e;
      } else {
        res.json({
          beer
        });
      }
    } catch (e) {
      return next(e);
    }
  }

  public async put(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = await BeerModel.findOneAndUpdate(
        {
          _id: req.params.beerId
        },
        <IBeerModel>req.body,
        {
          new: true
        }
      );
      res.json({
        beer
      });
    } catch (e) {
      next(e);
    }
  }

  public async remove(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = await BeerModel.findByIdAndDelete(
        req.params.beerId
      );
      if (beer === null) {
        res.status(404).json({
          error: 'not-found'
        });
      } else {
        res.status(204).send();
      }
    } catch (e) {
      next(e);
    }
  }
}

export default new BeersCtrl();
