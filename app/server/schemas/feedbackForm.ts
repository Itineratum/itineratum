import { z } from "zod";

export const feedbackNotificationEmailSchema = {
  input: z.object({
    userEmail: z.any(),
    userName: z.any(),
    rating: z.number(),
    feedbackCategory: z.any(),
    thoughtsSuggestions: z.string(),
    fileUrls: z.any(),
  }),
  output: z.void(),
};

export const feedbackReceivedEmailSchema = {
  input: z.object({ toEmail: z.string(), name: z.string() }),
  output: z.void(),
};
