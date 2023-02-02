import { type Request, type Response } from 'express';
import { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { jwtSecret } from '../config';
import { IUser } from '../types';

const signUp = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Another User with the same email already exists.' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const data = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    const token = jwt.sign({ email, id: data._id }, jwtSecret);
    res.status(201).json({ user: data, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'There was an error during Sign Up' });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: HydratedDocument<IUser> = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User does not exist.' });
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) return res.status(400).json({ msg: 'Invalid Credentials' });
    const token = jwt.sign({ email, id: user._id }, jwtSecret);
    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'There was an error during Login' });
  }
};
export { signUp, login };
