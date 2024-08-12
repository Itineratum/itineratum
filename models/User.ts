import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;
import { AuthService } from '@/constants/enums/authService';
import { Country } from '@/constants/enums/country';
import { IUser } from '@/constants/types/user';
import * as constDbCollections from '@/constants/dbCollections.json';

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  country: { type: String, enum: Country, required: true },
  phone_number: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  profile_picture: String,
  auth_service: { type: String, enum: AuthService, required: true }
}, { collection: constDbCollections.users });

const User = model('User', userSchema);
export default User;
