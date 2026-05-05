import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import COOKIE_NAME from '../constants/constants.js';

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({})
      .select('-password')
      .populate('blogs')
      .lean();
    return res.status(200).json({ users });
  } catch (error) {
    return next(error);
  }
};

export const getOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select('-password')
      .populate('blogs')
      .lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body as CreateUserBody;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ error: 'User already exists; cannot create duplicate user' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ name, email, password: passwordHash });
    return res.status(201).json({
      message: 'Ok',
      id: user.id,
      name: user.name,
      email: user.email,
      blogs: user.blogs,
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as CreateUserBody;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    res.clearCookie(COOKIE_NAME, {
      path: '/',
      httpOnly: true,
      signed: true,
    });

    const userObj = { id: user.id, name: user.name };

    const token = jwt.sign(userObj, process.env.SECRET as string, {
      expiresIn: '7d',
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: '/',
      expires,
      httpOnly: true,
      signed: true,
    });

    return res.status(200).json({
      message: 'OK',
      _id: user.id,
      name: user.name,
      email: user.email,
      blogs: user.blogs,
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      path: '/',
      httpOnly: true,
      signed: true,
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return next(error);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = res.locals.jwtData;
    const user = await User.findById(id);
    if (!user) {
      return res.status(402).json({ error: 'User not found' });
    }
    return res
      .status(200)
      .json({ message: 'User is already logged in', userId: id });
  } catch (error) {
    return next(error);
  }
};
