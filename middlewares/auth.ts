import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';

export const auth = (req: Request, res: Response, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(' ')[1];
      const user = jwt.verify(token, jwtSecret);
    } else {
      res.status(401).json({ msg: 'Unauthorized User' });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'Unauthorized User' });
  }
};
