import { z } from "zod";

export const addEmailToNewsletterSchema = {
  input: z.object({ email: z.string() }),
  output: z.boolean(),
};

export const checkEmailInNewsletterSchema = {
  input: z.object({ email: z.string() }),
  output: z.boolean(),
};
