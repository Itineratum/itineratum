import * as constDbCollections from "@/constants/dbCollections.json";
import { AuthService } from "@/constants/enums/authService";
import { Country } from "@/constants/enums/country";
import { Currency } from "@/constants/enums/currency";
import { Language } from "@/constants/enums/language";
import { IUser } from "@/constants/types/user";
import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    country: { type: String, enum: Country, required: true },
    phone_number: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    profile_picture: String,
    auth_service: { type: String, enum: AuthService, required: true },
    language: { type: String, enum: Language, default: Language.en },
    currency: { type: String, enum: Currency, default: Currency.sgd },
  },
  { collection: constDbCollections.users }
);

const User = model("User", userSchema);
export default User;
