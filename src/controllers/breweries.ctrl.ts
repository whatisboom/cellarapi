import { Request, Response } from 'express';
import BreweryModel from '../models/brewery.model';

function post(req: Request, res: Response): void {
  BreweryModel.create(req.body, (error, brewery) => {
    if (error) {
      res.status(500).json({
        error
      });
    } else {
      res.json({
        brewery
      });
    }
  })
}

function list(req: Request, res: Response): void {
  BreweryModel.find((error, breweries) => {
    res.json({
      breweries
    });
  });
}

function get(req: Request, res: Response): void {
  BreweryModel.findOne({
    _id: req.params.breweryId
  }).exec((error, brewery) => {
        if (error) {
      res.status(400).json({
        error
      });
    } else if (brewery === null) {
      res.status(404).json({
        error: 'not-found'
      })
    } else {
      res.json({
        brewery
      });
    }
  });
}

function put(req: Request, res: Response): void {
  BreweryModel.updateOne(req.body, (err, brewery) => {
    res.json({
      brewery
    });
  });
}

function remove(req: Request, res: Response): void {
  res.status(204).send();
}

const BreweriesCtrl = {
  post,
  list,
  get,
  put,
  remove
};

export default BreweriesCtrl;