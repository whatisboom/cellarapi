import { Request, Response } from "express";
import UserModel, { IUserModel } from "../models/user.model";
import * as bcrypt from 'bcryptjs';

const excludeFields = '-hash -salt';

export class UsersCtrl {

  public async post(req: Request, res: Response): Promise<void> {
    const {
      username,
      password,
      email,
      firstName,
      lastName
    } = req.body
    const salt = bcrypt.genSaltSync(10);
    try {
      const user: IUserModel = await UserModel.create({
        username,
        email,
        firstName,
        lastName,
        salt,
        hash: UserModel.schema.methods.getPasswordHash(password, salt),
      });
      excludeFields.split(' ').forEach(field => {
        user[field.slice(1)] = undefined;
      });
      res.json({
        user
      });
    } catch(error) {
      res.status(400).json({
        error
      });
    }
  }
  
  public async list(req: Request, res: Response): Promise<void> {
    try {
      const users: IUserModel[] = await UserModel.find({}, excludeFields);
      res.json({
        users
      });
    } catch (error) {
      res.status(500).json({
        error
      });
    }
  }
  
  public async get(req: Request, res: Response): Promise<void> {
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
  
  public async put(req: Request, res: Response): Promise<void> {
    try{
      const user: IUserModel = await UserModel.findOneAndUpdate({
        _id: req.params.userId
      }, req.body, {
        fields: excludeFields
      });
      res.json({
        user
      });
    } catch(error) {
      res.status(400).json({
        error
      });
    }
  }
  
  public async remove(req: Request, res: Response): Promise<void> {
    try {
      const user: IUserModel = await UserModel.findByIdAndDelete(req.params.userId);
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
  
  public async addBeer(req: Request, res: Response): Promise<void> {
    try {
      const {
        beerId
      } = req.body;
      
      const user: IUserModel = await UserModel.findOne({
        _id: req.params.userId
      });
      
      if (user === null) {
        res.status(404).json({
          error: "not-found"
        });
      } else {
        const beers: string[] = user.get('beers');
        const hasBeerAlready: boolean = beers.indexOf(beerId) !== -1;
        if (!hasBeerAlready) {
          beers.push(beerId);
        }
        if (user.isModified()) {
          await user.save();
        }
        res.json({
          user
        });
      }
    } catch (error) {
      res.status(500).json({
        error
      });
    }
  }

}


export default new UsersCtrl();
