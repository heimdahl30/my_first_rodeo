import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import COOKIE_NAME from '../constants/constants.js';

const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies[COOKIE_NAME] as string;
  if (!token || token.trim() === '') {
    return res.status(401).json({ error: 'Token not found' });
  }
  try {
    const decodedUser = jwt.verify(token, process.env.SECRET as string);
    res.locals.jwtData = decodedUser;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default tokenExtractor;
