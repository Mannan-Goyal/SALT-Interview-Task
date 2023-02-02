import { type Request, type Response } from 'express';
import { Document, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import qs from 'qs';
import axios from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';
import { jwtSecret, clientId, clientSecret, redirectUrl } from '../config';
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

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

const googleOauthHandler = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id_token, access_token }: any = await getGoogleOAuthTokens({ code });
    const googleUser = jwt.decode(id_token) as JwtPayload;
    console.log(googleUser);
    const existingUser = await User.findOne({ email: googleUser.email });
    let data = {} as Document;
    if (!existingUser) {
      data = await User.create({
        email: googleUser.email,
        password: null,
        username: googleUser.given_name,
      });
    } else {
      data = existingUser;
    }
    console.log(data);
    const token = jwt.sign({ email: googleUser.email, id: data._id }, jwtSecret);
    res.cookie('jwtToken', token);
    res.redirect(`http://localhost:3000?token=${token}`);
  } catch (error) {
    console.log(error, 'Failed to authorize google user');
    return res.redirect('http://localhost:3000');
  }
};

interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

const getGoogleOAuthTokens = async ({ code }: { code: string }): Promise<GoogleTokensResult> => {
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    grant_type: 'authorization_code',
  };
  try {
    const res = axios.post<GoogleTokensResult>(url, qs.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return (await res).data;
  } catch (error) {
    console.log(error, 'Failed to fetch Google OAuth Tokens');
  }
};

export { signUp, login, googleOauthHandler };
