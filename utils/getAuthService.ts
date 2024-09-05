import { AuthService } from "@/constants/enums/authService";

/**
 * Returns the corresponding auth service from the input provider.
 *
 *
 * @param provider - The authentication provider
 * @returns The AuthService of the corresponding input provider
 *
 */
export const getAuthService = (provider: string): AuthService => {
  return provider === "google"
    ? AuthService.Google
    : provider === "facebook"
      ? AuthService.Facebook
      : provider === "apple"
        ? AuthService.Apple
        : provider === "credentials"
          ? AuthService.Credentials
          : AuthService.Google; // default
};
