// @ts-nocheck

import * as constDbCollections from "@/constants/dbCollections.json";
import { AuthService } from "@/constants/enums/authService";
import { Country } from "@/constants/enums/country";
import { Currency } from "@/constants/enums/currency";
import { Language } from "@/constants/enums/language";
import { IUser, Notifications } from "@/constants/types/user";
import mongoose, { models } from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    country: { type: String, enum: Country, required: false },
    phone_number: {
      type: String,
      required: false,
      set: (value: any) => String(value),
    },
    email: { type: String, required: true, unique: true },
    address_1: { type: String, required: false },
    address_2: { type: String, required: false },
    date_of_birth: { type: Date, required: false },
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
    is_deleted: { type: Boolean, required: true, default: false },
    notifications: {
      type: Object,
      default: {
        newsletter: {
          email: true,
          push_notifications: false,
        },
        offers_updates: {
          email: true,
          push_notifications: false,
        },
      },
      required: true,
    },
  },
  { collection: constDbCollections.users }
);

export const initialUser = (
  first_name: string,
  email: string,
  profile_picture: string,
  auth_service: AuthService
) => {
  return {
    first_name,
    email,
    profile_picture,
    auth_service,
    account_created: Date.now(),
    language: "en",
    currency: "sgd",
  };
};

export default models.User || mongoose.model("User", userSchema);
