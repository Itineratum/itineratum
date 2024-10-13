import { AuthService } from "../enums/authService";
import { Currency } from "../enums/currency";
import { Language } from "../enums/language";

export interface IUser {
  first_name?: String | undefined;
  last_name?: String | undefined;
  country?: String | undefined;
  phone_number?: Number | undefined;
  email: String;
  address_1?: String | undefined;
  address_2?: String | undefined;
  date_of_birth?: Date | undefined;
  profile_picture?: String | undefined;
  auth_service: AuthService;
  language: Language;
  currency: Currency;
  account_created: Date;
  password: string;
  is_deleted: boolean;
  notifications: Notifications
}

export interface Notifications {
  newsletter: NotificationsOptions;
  offers_updates: NotificationsOptions
}

interface NotificationsOptions {
  email: boolean;
  push_notifications: boolean;
}
