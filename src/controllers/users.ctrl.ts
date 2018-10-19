import { Request, Response } from "express";
import UserModel from "../models/user.model";
import * as bcrypt from 'bcryptjs';

const excludeFields = '-hash -salt';

async function post(req: Request, res: Response): Promise<void> {
  const {
    username,
    password,
    email,
    firstName,
    lastName
  } = req.body
  const salt = bcrypt.genSaltSync(10);
  try {
    const user = await UserModel.create({
      username,
      email,
      firstName,
      lastName,
      salt,
      hash: UserModel.schema.methods.getPasswordHash(password, salt),
    }, excludeFields);
    res.json({
      user
    });
  } catch(error) {
    res.status(400).json({
      error
    });
  }
}

async function list(req: Request, res: Response): Promise<void> {
  try {
    const users = await UserModel.find({}, excludeFields);
    res.json({
      users
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
}

async function get(req: Request, res: Response): Promise<void> {
  try {
    const user = await UserModel.findOne({
      _id: req.params.userId
    }).populate({
      path: 'beers',
      populate: {
        path: 'brewery'
      }
    }).exec();
    if (user === null) {
      res.status(404).json({
        error: 'not-found'
      })
    } else {
      res.json({
        user
      });
    }
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

async function put(req: Request, res: Response): Promise<void> {
  try{
    const user = await UserModel.updateOne({
      _id: req.params.userId
    }, req.body);
    res.json({
      user
    });
  } catch(error) {
    res.status(400).json({
      error
    });
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.userId);
    if (user === null) {
      res.status(404).json({
        error: 'not-found'
      });
    } else {
      res.status(204).send();
    }
  } catch(error) {
    res.status(400).json({
      error
    });
  }
}

async function addBeer(req: Request, res: Response): Promise<void> {
  try {
    const {
      beerId
    } = req.body;
    
    const user = await UserModel.findOne({
      _id: req.params.userId
    });
    
    if (user === null) {
      res.status(404).json({
        error: "not-found"
      });
    } else {
      const beers: string[] = user.get('beers');
      const hasBeerAlready = beers.indexOf(beerId) !== -1;
      if (!hasBeerAlready) {
        beers.push(beerId);
      }
      try {
        if (user.isModified()) {
          await user.save();
        }
        res.json({
          user
        });
      } catch (error) {
        res.status(500).json({
          error
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      error
    });
  }
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
