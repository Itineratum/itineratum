// @ts-nocheck

import * as constDbCollections from "@/constants/dbCollections.json";
import { AuthService } from "@/constants/enums/authService";
import { Country } from "@/constants/enums/country";
import { Currency } from "@/constants/enums/currency";
import { Language } from "@/constants/enums/language";
import { IUser } from "@/constants/types/user";
import mongoose, { models } from "mongoose";
const { Schema } = mongoose;


const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    country: { type: String, enum: Country, required: false },
    phone_number: { type: String, required: false, set: (v: any) => String(v) },
    email: { type: String, required: true, unique: true },
    profile_picture: { type: String, required: false },
    auth_service: { type: String, enum: AuthService, required: true },
    language: {
      type: String,
      enum: Object.keys(Language),
      default: "en",
      required: true,
    },
    currency: {
      type: String,
      enum: Object.keys(Currency),
      default: "sgd",
      required: true,
    },
    account_created: { type: Date, required: true },
    password: { type: String, required: false }, // password is stored as hash only if users sign up using credentials
  },
  { collection: constDbCollections.users }
);

export const initialUser = (
  name: string,
  email: string,
  profile_picture: string,
  auth_service: AuthService
) => {
  return {
    name,
    email,
    profile_picture,
    auth_service,
    account_created: Date.now(),
  };
};

export default models.User || mongoose.model("User", userSchema);
