import { Request, Response, NextFunction } from "express";
import UserModel, { IUserModel } from "../models/user.model";
import * as bcrypt from 'bcryptjs';
import { ApiError } from '../types';

const excludeFields = '-hash -salt';

export class UsersCtrl {
  
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users: IUserModel[] = await UserModel.find({}, excludeFields);
      res.json({
        users
      });
    } catch (e) {
      return next(e);
    }
  }
  
  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: IUserModel = await UserModel.findOne({
        _id: req.params.userId
      }, excludeFields).populate({
        path: 'beers',
        populate: {
          path: 'brewery'
        }
      }).exec();
      if (user === null) {
        const e: ApiError = <ApiError>new Error('not-found');
        e.status = 404;
        throw e;
      } else {
        res.json({
          user
        });
      }
    } catch (e) {
      return next(e);
    }
  }
  
  public async put(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const user: IUserModel = await UserModel.findOneAndUpdate({
        _id: req.params.userId
      }, <IUserModel>req.body, {
        fields: excludeFields,
        new: true
      }).exec();
      if (user === null) {
        const e: ApiError = <ApiError>new Error('not-found');
        e.status = 404;
        throw e;
      } else {
        res.json({
          user
        });
      }
    } catch(e) {
      return next(e);
    }
  }
  
  public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: IUserModel = await UserModel.findByIdAndDelete(req.params.userId);
      if (user === null) {
        const e: ApiError = <ApiError>new Error('not-found');
        e.status = 404;
        throw e;
      } else {
        res.sendStatus(204);
      }
    } catch(e) {
      return next(e);
    }
  }
  
  public async addBeer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        beerId
      } = req.body;
      
      const user: IUserModel = await UserModel.findOne({
        _id: req.params.userId
      });
      
      if (user === null) {
        const e: ApiError = <ApiError>new Error('not-found');
        e.status = 404;
        throw e;
      } else {
        const beers: string[] = user.get('beers');
        const hasBeerAlready: boolean = beers.indexOf(beerId) !== -1;
        if (!hasBeerAlready) {
          beers.push(beerId);
          await user.save();
          res.json({
            user
          });
        }
        else {
          res.sendStatus(304);
        }
      }
    } catch (e) {
      return next(e);
    }
  }

}


export default new UsersCtrl();
