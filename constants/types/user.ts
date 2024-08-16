import { AuthService } from "../enums/authService";
import { Currency } from "../enums/currency";
import { Language } from "../enums/language";

export interface IUser {
  username: String;
  first_name: String;
  last_name: String;
  country: String;
  phone_number: Number;
  email: String;
  profile_picture?: String | undefined;
  auth_service: AuthService;
  language: Language;
  currency: Currency;
}
