import {
  AccountNotificationsField,
  AccountNotificationsFieldType,
} from "@/constants/enums/accountNotifications";
import { Currency } from "@/constants/enums/currency";
import { Language } from "@/constants/enums/language";
import { enumToZod } from "@/utils/enumToZod";
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

export const loginViaEmailSchema = {
  input: z.object({
    email: z.string(),
    password: z.string(),
  }),
  output: z.void(),
};

// TODO: if OTP is being set up in the future, complete this?
export const loginViaOtpSchema = {
  input: z.object({
    phoneNumber: z.string(),
  }),
  output: z.void(),
};

export const switchCurrencySchema = {
  input: z.object({
    email: z.string(),
    currency: z.enum(enumToZod(Currency)),
  }),
  output: z.void(),
};

export const switchLanguageSchema = {
  input: z.object({
    email: z.string(),
    language: z.enum(enumToZod(Language)),
  }),
  output: z.void(),
};

export const getUserCurrencyLanguageSchema = {
  input: z.object({
    email: z.string(),
  }),
  output: z.object({
    currency: z.enum(enumToZod(Currency)),
    language: z.enum(enumToZod(Language)),
  }),
};

export const getUserAccountDetailsSchema = {
  input: z.object({
    email: z.string(),
  }),
  output: z.object({
    firstName: z.string().default(""),
    lastName: z.string().default(""),
    email: z.string(),
    address1: z.string().default(""),
    address2: z.string().default(""),
    dateOfBirth: z.date().optional(),
  }),
};

export const updateUserAccountSchema = {
  input: z.object({
    email: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    dateOfBirth: z.string().optional(),
  }),
  output: z.void(),
};

export const deleteUserAccountSchema = {
  input: z.object({
    email: z.string(),
  }),
  output: z.void(),
};

export const changeUserPasswordSchema = {
  input: z.object({
    email: z.string(),
    currentPassword: z.string(),
    newPassword: z.string(),
  }),
  output: z.void(),
};

export const getUserNotificationsSettingsSchema = {
  input: z.object({
    email: z.string(),
  }),
  output: z.object({
    newsletter: z.object({
      email: z.boolean(),
      pushNotifications: z.boolean(),
    }),
    allOffersUpdates: z.object({
      email: z.boolean(),
      pushNotifications: z.boolean(),
    }),
  }),
};

export const updateUserNotificationsSettingsSchema = {
  input: z.object({
    email: z.string(),
    field: z.enum(enumToZod(AccountNotificationsField)),
    fieldType: z.enum(enumToZod(AccountNotificationsFieldType)),
    value: z.boolean(),
  }),
  output: z.void(),
};
