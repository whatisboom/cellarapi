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
    const existingUser = await UserModel.findOne({
      email
    });
    if (existingUser !== null) {
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
    password
  } = req.body;

  try {
    const user = await UserModel.findOne({
      username
    }, 'username salt hash');

    const isValidPassword = user.schema.methods.isPasswordValid(
      password, user
    );
    if (isValidPassword) {
      const token = jsonwebtoken.sign({
        user
      }, process.env.JWT_SECRET);

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