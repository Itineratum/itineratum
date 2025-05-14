"use client";

import { trpc } from "@/app/_trpc/client";
import { LogInFormOtpData } from "@/constants/types/formData/logInFormData";
import { CountryCode } from "libphonenumber-js";
import { createContext, ReactNode } from "react";
import {
  Control,
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

type LoginOtpContextType = {
  control: Control<LogInFormOtpData, any>;
  handleSubmit: UseFormHandleSubmit<LogInFormOtpData, undefined>;
  errors: FieldErrors<LogInFormOtpData>;
  getValues: UseFormGetValues<LogInFormOtpData>;
  setValue: UseFormSetValue<LogInFormOtpData>;
  trigger: UseFormTrigger<LogInFormOtpData>;
  countryCode: string;
  number: string;
  otp: string;
  country: CountryCode;
  loginViaOtp: any;
  onSubmit: SubmitHandler<LogInFormOtpData>;
};

export const LoginOtpContext = createContext<LoginOtpContextType | undefined>(
  undefined,
);

export const LoginOtpProvider = ({ children }: { children: ReactNode }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    trigger,
  } = useForm<LogInFormOtpData>();

  const countryCodeId = "countryCode";
  const numberId = "number";
  const otpId = "otp";
  const countryId = "country";

  const countryCode = watch(countryCodeId);
  const number = watch(numberId);
  const otp = watch(otpId);
  const country = watch(countryId);

  const loginViaOtp = trpc.user.loginViaOtp.useMutation({
    onSuccess: () => {},
  });

  const onSubmit: SubmitHandler<LogInFormOtpData> = async (data) => {
    // TODO:
  };

  return (
    <LoginOtpContext.Provider
      value={{
        control,
        handleSubmit,
        errors,
        getValues,
        setValue,
        trigger,
        countryCode,
        number,
        otp,
        country,
        loginViaOtp,
        onSubmit,
      }}
    >
      {children}
    </LoginOtpContext.Provider>
  );
};
