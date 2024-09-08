import { sendSignUpVerificationEmail } from "@/lib/nodeMailer";
import { credentialsLogIn, credentialsSignUp } from "@/services/database/users";
import {
  generateAndSaveVerificationCode,
  verifyVerificationCode,
} from "@/services/database/verificationCodes";
import { TRPCError } from "@trpc/server";
import {
  generateVerificationCodeSchema,
  loginViaEmail,
  loginViaOtp,
  verifyVerificationCodeSchema,
} from "../schemas/user";
import { publicProcedure, router } from "../trpc";

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
    .input(loginViaEmail.input)
    .output(loginViaEmail.output)
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
    .input(loginViaOtp.input)
    .output(loginViaOtp.output)
    .mutation(async (data) => {
      // TODO: if OTP is being set up in the future, complete this?
      const { phoneNumber } = data.input;
    }),
});

export type UserRouter = typeof userRouter;
