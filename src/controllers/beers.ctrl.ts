import { Request, Response } from "express";
import BeerModel from "../models/beer.model";

async function post(req: Request, res: Response): Promise<void> {
  try {
    const beer = await BeerModel.create(req.body);
    res.json({
      beer
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
}

async function list(req: Request, res: Response): Promise<void> {
  try {
    const beers = await BeerModel.find({});
    res.json({
      beers
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
}

async function get(req: Request, res: Response): Promise<void> {
  try {
    const beer = await BeerModel.findOne({
      _id: req.params.beerId
    }).populate('brewery').exec();
    if (beer === null) {
      res.status(404).json({
        error: 'not-found'
      })
    } else {
      res.json({
        beer
      });
    }
  } catch (error) {
    res.status(500).json({
      error
    });
  }
}

async function put(req: Request, res: Response): Promise<void> {
  try {
    const beer = await BeerModel.updateOne({
        _id: req.params.beerId    
      },
      req.body
    );
    res.json({
      beer
    });
  } catch (error) {
    res.status(400).json({
      error
    })
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const beer = await BeerModel.findByIdAndDelete(req.params.beerId);
    if (beer === null) {
      res.status(404).json({
        error: 'not-found'
      });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({
      error
    });
  }
}

const BeersCtrl = {
  post,
  list,
  get,
  put,
  remove
};

export default BeersCtrl;