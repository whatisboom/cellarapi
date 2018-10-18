import { Request, Response } from "express";
import BeerModel from "../models/beer.model";

function post(req: Request, res: Response): void {
  BeerModel.create(req.body, (error, beer) => {
    if (error) {
      res.status(500).json({
        error
      });
    } else {
      res.json({
        beer
      });
    }
  });
}

function list(req: Request, res: Response): void {
  BeerModel.find((err, beers) => {
    res.json({
      beers
    });
  });
}

function get(req: Request, res: Response): void {
  BeerModel.findOne({
    _id: req.params.beerId
  }).populate('brewery').exec((err, beer) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    } else if (beer === null) {
      res.status(404).json({
        error: 'not-found'
      })
    } else {
      res.json({
        beer
      });
    }
  });
}

function put(req: Request, res: Response): void {
  BeerModel.updateOne(req.body, (err, user) => {
    res.json({
      user
    });
  });
}

function remove(req: Request, res: Response): void {
  res.status(204).send();
}

const BeersCtrl = {
  post,
  list,
  get,
  put,
  remove
};

export default BeersCtrl;