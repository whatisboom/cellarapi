import { Request, Response, NextFunction } from "express";
import * as jsonwebtoken from 'jsonwebtoken';
import UserModel, { IUserModel } from '../models/user.model';
import * as bcrypt from 'bcryptjs';
import { ApiError } from '../types';

const excludeFields = '-hash -salt';

export class AuthCtrl {
  public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {
      email,
      password,
      username
    } = req.body;
    try {
      const existingUser: IUserModel = await UserModel.findOne({
        $or: [
          {
            username
          }, {
            email
          }
        ]
      });
      if (existingUser) {
        const e: ApiError = <ApiError>new Error('duplicate-user');
        e.status = 409;
        throw e;
      }
    } catch (e) {
      return next(e);
    }
    try {
      const salt = bcrypt.genSaltSync(10);
      const user = await UserModel.create({
        ...req.body,
        hash: UserModel.schema.methods.getPasswordHash(password, salt),
        salt
      });
      excludeFields.split(' ').forEach(field => {
        user[field.slice(1)] = undefined;
      });
      res.json({
        user
      });
    } catch (e) {
      return next(e)
    }
  }
  
  public async signin(req: Request, res:Response, next: NextFunction): Promise<void> {
    const {
      username,
      password,
      forever
    } = req.body;
    
    const jwtOptions: jsonwebtoken.SignOptions = {};

    if (!forever) {
      jwtOptions.expiresIn = '1d';
    }
  
    try {

      const user = await UserModel.findOne({
        username
      }, 'username _id salt hash role');
  
      const isValidPassword = user.schema.methods.isPasswordValid(
        password, user
      );

      if (isValidPassword) {

        const token = jsonwebtoken.sign({
          _id: user.get('_id'),
          username: user.get('username'),
          role: user.get('role')
        }, process.env.JWT_SECRET, jwtOptions);

        res.json({
          token
        });

      } else {
        const e: ApiError = <ApiError>new Error('invalid-auth')
        e.status = 401;
        throw e;
      }
    } catch (e) {
      next(e);
    }
    
  }  
}

export default new AuthCtrl();