import { CountryCode } from "libphonenumber-js";

export interface LogInFormEmailData {
  email: string;
  password: string;
}

export interface LogInFormOtpData {
  countryCode: string;
  country: CountryCode;
  number: string;
  otp: string;
}
