import { AuthService } from "../enums/auth_service"

export interface IUser {
  username: String,
  first_name: String,
  last_name: String,
  country: String
  phone_number: Number,
  email: String,
  profile_picture?: String | undefined,
  auth_service: AuthService
}