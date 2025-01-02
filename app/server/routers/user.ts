import {
  AccountNotificationsField,
  AccountNotificationsFieldType,
} from "@/constants/enums/accountNotifications";
import {
  sendAccountDeletedEmail,
  sendAccountPasswordChangedEmail,
  sendNewsletterSubscribedEmail,
  sendSignUpVerificationEmail,
} from "@/lib/nodeMailer";
import {
  addEmailToNewsletter,
  removeEmailFromNewsletter,
} from "@/services/database/newsletterEmails";
import {
  credentialsLogIn,
  credentialsSignUp,
  deleteUser,
  retrieveCurrencyLanguage,
  retrieveUserDetails,
  updateUser,
  verifyUserPassword,
} from "@/services/database/users";
import {
  generateAndSaveVerificationCode,
  verifyVerificationCode,
} from "@/services/database/verificationCodes";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import {
  changeUserPasswordSchema,
  deleteUserAccountSchema,
  generateVerificationCodeSchema,
  getUserAccountDetailsSchema,
  getUserCurrencyLanguageSchema,
  getUserNotificationsSettingsSchema,
  loginViaEmailSchema,
  loginViaOtpSchema,
  switchCurrencySchema,
  switchLanguageSchema,
  updateUserAccountSchema,
  updateUserNotificationsSettingsSchema,
  verifyVerificationCodeSchema,
} from "../schemas/user";
import { privateProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  generateVerificationCode: publicProcedure
    .input(generateVerificationCodeSchema.input)
    .output(generateVerificationCodeSchema.output)
    .mutation(async (data) => {
      const email = data.input.email;
      const verificationCodeSaveRes =
        await generateAndSaveVerificationCode(email);

      if (
        verificationCodeSaveRes?.success &&
        verificationCodeSaveRes.verificationCode
      ) {
        const verificationCode = verificationCodeSaveRes.verificationCode;
        await sendSignUpVerificationEmail(email, verificationCode);
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: verificationCodeSaveRes?.error!,
        });
      }
    }),
  verifyVerificationCode: publicProcedure
    .input(verifyVerificationCodeSchema.input)
    .output(verifyVerificationCodeSchema.ouput)
    .mutation(async (data) => {
      const {
        email,
        country,
        countryCode,
        number,
        password,
        verificationCode,
      } = data.input;
      const verifyVerificationCodeRes = await verifyVerificationCode(
        email,
        verificationCode,
      );

      if (!verifyVerificationCodeRes.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: verifyVerificationCodeRes?.error!,
        });
      }

      const signUpRes = await credentialsSignUp(
        country,
        countryCode,
        number,
        email,
        password,
      );

      if (!signUpRes.success) {
        throw new TRPCError({
          code: "CONFLICT",
          message: signUpRes?.error!,
        });
      }
    }),
  loginViaEmail: publicProcedure
    .input(loginViaEmailSchema.input)
    .output(loginViaEmailSchema.output)
    .mutation(async (data) => {
      const { email, password } = data.input;
      const loginRes = await credentialsLogIn(email, password);

      if (!loginRes.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: loginRes.error,
        });
      }
    }),
  loginViaOtp: publicProcedure
    .input(loginViaOtpSchema.input)
    .output(loginViaOtpSchema.output)
    .mutation(async (data) => {
      // TODO: if OTP is being set up in the future, complete this?
      const { phoneNumber } = data.input;
    }),
  switchCurrency: publicProcedure
    .input(switchCurrencySchema.input)
    .output(switchCurrencySchema.output)
    .mutation(async (data) => {
      const { email, currency } = data.input;
      const updateUserRes = await updateUser(email, { currency });

      if (!updateUserRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateUserRes.error,
        });
      }
    }),
  switchLanguage: publicProcedure
    .input(switchLanguageSchema.input)
    .output(switchLanguageSchema.output)
    .mutation(async (data) => {
      const { email, language } = data.input;
      const updateUserRes = await updateUser(email, { language });

      if (!updateUserRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateUserRes.error,
        });
      }
    }),
  getUserCurrencyLanguage: privateProcedure
    .input(getUserCurrencyLanguageSchema.input)
    .output(getUserCurrencyLanguageSchema.output)
    .query(async (data) => {
      const { email } = data.input;
      const retrieveCurrencyLanguageRes = await retrieveCurrencyLanguage(email);

      if (!retrieveCurrencyLanguageRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: retrieveCurrencyLanguageRes.error,
        });
      } else {
        const currency = retrieveCurrencyLanguageRes.data?.currency as string;
        const language = retrieveCurrencyLanguageRes.data?.language as string;
        return {
          currency,
          language,
        };
      }
    }),
  getUserAccountDetails: privateProcedure
    .input(getUserAccountDetailsSchema.input)
    .output(getUserAccountDetailsSchema.output)
    .query(async (data) => {
      const { email } = data.input;
      const retrieveUserDetailsRes = await retrieveUserDetails(email);

      if (!retrieveUserDetailsRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: retrieveUserDetailsRes.error,
        });
      } else {
        const user = retrieveUserDetailsRes.data;
        return {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          address1: user.address_1,
          address2: user.address_2,
          dateOfBirth: user.date_of_birth,
        };
      }
    }),
  updateUserAccount: privateProcedure
    .input(updateUserAccountSchema.input)
    .output(updateUserAccountSchema.output)
    .mutation(async (data) => {
      const { email, firstName, lastName, address1, address2, dateOfBirth } =
        data.input;

      const update = {
        $set: {
          first_name: firstName,
          last_name: lastName,
          address_1: address1,
          address_2: address2,
          date_of_birth: dateOfBirth,
        },
      };
      const updateUserRes = await updateUser(email, update);

      if (!updateUserRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateUserRes.error,
        });
      }
    }),
  deleteUserAccount: privateProcedure
    .input(deleteUserAccountSchema.input)
    .output(deleteUserAccountSchema.output)
    .mutation(async (data) => {
      const { email } = data.input;
      const deleteUserRes = await deleteUser(email);
      await sendAccountDeletedEmail(email);

      if (!deleteUserRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: deleteUserRes.error,
        });
      }
    }),
  changeUserPassword: privateProcedure
    .input(changeUserPasswordSchema.input)
    .output(changeUserPasswordSchema.output)
    .mutation(async (data) => {
      const { email, currentPassword, newPassword } = data.input;

      // verify that the user has entered the correct current password
      const verifyUserPasswordRes = await verifyUserPassword(
        email,
        currentPassword,
      );

      if (!verifyUserPasswordRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: verifyUserPasswordRes.error,
        });
      }

      // if the user has entered the correct current password, proceed to update their password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      const update = {
        $set: {
          password: hashedNewPassword,
        },
      };
      const updateUserRes = await updateUser(email, update);
      await sendAccountPasswordChangedEmail(email);

      if (!updateUserRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateUserRes.error,
        });
      }
    }),
  getUserNotificationsSettings: privateProcedure
    .input(getUserNotificationsSettingsSchema.input)
    .output(getUserNotificationsSettingsSchema.output)
    .query(async (data) => {
      const { email } = data.input;
      const retrieveUserDetailsRes = await retrieveUserDetails(email);

      if (!retrieveUserDetailsRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: retrieveUserDetailsRes.error,
        });
      } else {
        const notificationsSettings = retrieveUserDetailsRes.data.notifications;
        return {
          newsletter: {
            email: notificationsSettings.newsletter.email,
            pushNotifications:
              notificationsSettings.newsletter.push_notifications,
          },
          allOffersUpdates: {
            email: notificationsSettings.all_offers_updates.email,
            pushNotifications:
              notificationsSettings.all_offers_updates.push_notifications,
          },
        };
      }
    }),
  updateUserNotificationsSettings: privateProcedure
    .input(updateUserNotificationsSettingsSchema.input)
    .output(updateUserNotificationsSettingsSchema.output)
    .mutation(async (data) => {
      const { email, name, field, fieldType, value } = data.input;

      let updateField: string;
      let updateFieldType: string;

      updateField =
        field === AccountNotificationsField.newsletter
          ? field
          : "all_offers_updates";
      updateFieldType =
        fieldType === AccountNotificationsFieldType.email
          ? fieldType
          : "push_notifications";

      if (
        updateField === AccountNotificationsField.newsletter &&
        updateFieldType === AccountNotificationsFieldType.email
      ) {
        if (value) {
          const addEmailToNewsletterRes = await addEmailToNewsletter(email, name);
          sendNewsletterSubscribedEmail(email, name);

          if (!addEmailToNewsletterRes.success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: addEmailToNewsletterRes.error,
            });
          }
        } else {
          const removeEmailFromNewsletterRes =
            await removeEmailFromNewsletter(email);

          if (!removeEmailFromNewsletterRes.success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: removeEmailFromNewsletterRes.error,
            });
          }
        }
      }

      const update = {
        $set: {
          [`notifications.${updateField}.${updateFieldType}`]: value,
        },
      };

      const updateUserRes = await updateUser(email, update);

      if (!updateUserRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateUserRes.error,
        });
      }
    }),
});

export type UserRouter = typeof userRouter;
