import { z } from "zod";

export const generateVerificationCodeSchema = {
  input: z.object({ email: z.string() }),
  output: z.void(),
};

export const verifyVerificationCodeSchema = {
  input: z.object({
    email: z.string(),
    country: z.string(),
    countryCode: z.string(),
    number: z.string(),
    password: z.string(),
    verificationCode: z.string(),
  }),
  ouput: z.void(),
};

export const loginViaEmail = {
  input: z.object({
    email: z.string(),
    password: z.string(),
  }),
  output: z.void(),
};

// TODO: if OTP is being set up in the future, complete this?
export const loginViaOtp = {
  input: z.object({
    phoneNumber: z.string(),
  }),
  output: z.void(),
};
