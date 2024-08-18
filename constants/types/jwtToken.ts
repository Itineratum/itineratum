import { JWT } from "next-auth/jwt";

export default interface JWTToken extends JWT {
  provider?: string;
}
