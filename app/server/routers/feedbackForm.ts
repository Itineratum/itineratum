import {
  sendFeedbackEmailNotification,
  sendFeedbackReceivedEmail,
} from "@/lib/nodeMailer";
import {
  feedbackNotificationEmailSchema,
  feedbackReceivedEmailSchema,
} from "../schemas/feedbackForm";
import { publicProcedure, router } from "../trpc";

export const feedbackFormRouter = router({
  feedbackNotificationEmail: publicProcedure
    .input(feedbackNotificationEmailSchema.input)
    .output(feedbackNotificationEmailSchema.output)
    .mutation(async (data) => {
      const userEmail = data.input.userEmail;
      const userName = data.input.userName;
      const rating = data.input.rating;
      const feedbackCategory = data.input.feedbackCategory;
      const thoughtsSuggestions = data.input.thoughtsSuggestions;
      const fileUrls = data.input.fileUrls;
      await sendFeedbackEmailNotification(
        userEmail,
        userName,
        rating,
        feedbackCategory,
        thoughtsSuggestions,
        fileUrls,
      );
    }),
  feedbackReceivedEmail: publicProcedure
    .input(feedbackReceivedEmailSchema.input)
    .output(feedbackReceivedEmailSchema.output)
    .mutation(async (data) => {
      const toEmail = data.input.toEmail;
      const name = data.input.name;
      await sendFeedbackReceivedEmail(toEmail, name);
    }),
});
