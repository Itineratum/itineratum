import {
  addEmailToNewsletter,
  checkEmailInNewsletter,
} from "@/services/database/newsletterEmails";
import { publicProcedure, router } from "../trpc";
import {
  addEmailToNewsletterSchema,
  checkEmailInNewsletterSchema,
} from "../schemas/newsletterEmail";
import {
  AccountNotificationsField,
  AccountNotificationsFieldType,
} from "@/constants/enums/accountNotifications";
import { updateUser } from "@/services/database/users";
import { TRPCError } from "@trpc/server";
import { sendNewsletterSubscribedEmail } from "@/lib/nodeMailer";

export const newsletterEmailRouter = router({
  addEmailToNewsletter: publicProcedure
    .input(addEmailToNewsletterSchema.input)
    .output(addEmailToNewsletterSchema.output)
    .mutation(async (data) => {
      const email = data.input.email;
      const addEmailToNewsletterRes = await addEmailToNewsletter(email);
      sendNewsletterSubscribedEmail(email);

      const update = {
        $set: {
          [`notifications.${AccountNotificationsField.newsletter}.${AccountNotificationsFieldType.email}`]:
            true,
        },
      };
      const updateUserRes = await updateUser(email, update);

      if (!updateUserRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateUserRes.error,
        });
      }

      // true means the email has been successfully added to the newsletter
      // false means that the email is already on the newsletter
      return addEmailToNewsletterRes.success;
    }),
  checkEmailInNewsletter: publicProcedure
    .input(checkEmailInNewsletterSchema.input)
    .output(checkEmailInNewsletterSchema.output)
    .query(async (data) => {
      const email = data.input.email;
      const checkEmailInNewsletterRes = await checkEmailInNewsletter(email);

      // true means the email is already in the newsletter
      // false means that the email is not in the newsletter
      return checkEmailInNewsletterRes.success;
    }),
});
