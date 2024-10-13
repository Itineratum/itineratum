import { z } from "zod";

export const getAllFAQsSchema = {
  input: z.void(),
  output: z
    .object({
      index: z.number(),
      question: z.string(),
      answer: z.string(),
    })
    .array(),
};
