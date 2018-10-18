import { Request, Response } from "express";
import UserModel from "../models/user.model";

function post(req: Request, res: Response): void {
  UserModel.create(req.body, (err, user) => {
    res.json({
      user
    });
  });
}

function list(req: Request, res: Response): void {
  UserModel.find((err, users) => {
    res.json({
      users
    });
  });
}

function get(req: Request, res: Response): void {
  UserModel.findOne({
    _id: req.params.userId
  }).populate({
    path: 'beers',
    populate: {
      path: 'brewery'
    }
  }).exec((err, user) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    } else if (user === null) {
      res.status(404).json({
        error: 'not-found'
      })
    } else {
      res.json({
        user
      });
    }
  });
}

function put(req: Request, res: Response): void {
  UserModel.updateOne(req.body, (err, user) => {
    res.json({
      user
    });
  });
}

function remove(req: Request, res: Response): void {
  res.status(204).send();
}

function addBeer(req: Request, res: Response): void {
  const {
    beerId
  } = req.body;
  UserModel.findOne({
    _id: req.params.userId
  }, (error, user) => {
    if (error) {
      res.status(400).json({
        error
      });
    } else if (user === null) {
      res.status(404).json({
        error: "not-found"
      });
    } else {
      const beers = user.get('beers');
      const hasBeerAlready = beers.filter((beer) => {
        return beer === beerId;
      }).length > 0;
      if (!hasBeerAlready) {
        beers.push(beerId);
      }
      user.save((error) => {
        if (error) {
          res.status(500).json({
            error
          });
        } else {
          res.json({
            user
          });
        }
      });
    }
  });
}


const UsersCtrl = {
  post,
  list,
  get,
  put,
  remove,
  addBeer
};

export default UsersCtrl;
