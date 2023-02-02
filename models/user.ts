import mongoose from 'mongoose';
import { IUser } from '../types';

const { Schema } = mongoose;

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  password: {
    type: String,
    required: false,
  },
});

const User = mongoose.model<IUser>('users', UserSchema);
export default User;
