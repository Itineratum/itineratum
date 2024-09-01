import { AuthService } from "../enums/authService";
import { Currency } from "../enums/currency";
import { Language } from "../enums/language";

export interface IUser {
  name?: String | undefined;
  country?: String | undefined;
  phone_number?: Number | undefined;
  email: String;
  profile_picture?: String | undefined;
  auth_service: AuthService;
  language: Language;
  currency: Currency;
  account_created: Date;
  password: string;
}
