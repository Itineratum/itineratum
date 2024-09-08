import { z } from "zod";

export const generateVerificationCodeInput = z.object({
  email: z.string(),
});

export const generateVerificationCodeOutput = z.void();
