import { Request, Response } from "express";
import * as jsonwebtoken from 'jsonwebtoken';
import UserModel from '../models/user.model';
import * as bcrypt from 'bcryptjs';

async function signup(req: Request, res: Response): Promise<void> {
  const {
    email,
    password,
    username
  } = req.body;
  try {
    const existingUser = await UserModel.find({
      $or: [
        {
          username
        }, {
          email
        }
      ]
    });
    if (existingUser.length !== 0) {
      res.status(409).json({
        error: 'duplicate'
      });
    }
  } catch (error) {
    res.status(500).json({
      error
    });
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const user = await UserModel.create({
      email,
      username,
      hash: UserModel.schema.methods.getPasswordHash(password, salt),
      salt
    });
    res.json({
      user
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
}

async function signin(req: Request, res:Response): Promise<void> {
  const {
    username,
    password,
    forever
  } = req.body;
  
  const options: jsonwebtoken.SignOptions = {};
  if (!forever) {
    options.expiresIn = '1d';
  }

  try {
    const user = await UserModel.findOne({
      username
    }, 'username salt hash');

    const isValidPassword = user.schema.methods.isPasswordValid(
      password, user
    );
    if (isValidPassword) {
      const token = jsonwebtoken.sign({
        username: user.get('username')
      }, process.env.JWT_SECRET, options);

      res.json({
        token
      });
    } else {
      res.status(401).json({
        error: 'invalid-auth'
      });
    }
  } catch (error) {
    res.json({
      error
    });
  }
  
}

const AuthCtrl = {
  signin,
  signup
};

export default AuthCtrl;