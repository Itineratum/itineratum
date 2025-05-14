"use client";

import { trpc } from "@/app/_trpc/client";
import { LogInFormEmailData } from "@/constants/types/formData/logInFormData";
import { useLogin } from "@/hooks/useLogin";
import { TRPCClientError } from "@trpc/client";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback } from "react";
import {
  Control,
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormHandleSubmit,
} from "react-hook-form";

type LoginEmailContextType = {
  control: Control<LogInFormEmailData, any>;
  handleSubmit: UseFormHandleSubmit<LogInFormEmailData, undefined>;
  errors: FieldErrors<LogInFormEmailData>;
  email: string;
  password: string;
  onSubmit: SubmitHandler<LogInFormEmailData>;
};

export const LoginEmailContext = createContext<
  LoginEmailContextType | undefined
>(undefined);

export const LoginEmailProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LogInFormEmailData>();
  const { setIsLoggingIn, setAlertText, setShowAlert } = useLogin();

  const emailId = "email";
  const passwordId = "password";
  const email = watch(emailId);
  const password = watch(passwordId);
  const t = useTranslations("login.loginForm");

  const loginViaEmail = trpc.user.loginViaEmail.useMutation({
    onSuccess: async () => {
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes && signInRes.ok) {
        setAlertText("");
        setShowAlert(false);
        const searchParams = new URLSearchParams(window.location.search);
        const returnUrl = searchParams.get("returnUrl");

        if (returnUrl) {
          // if the user was earlier told to log in to save the generated itinerary, redirect them back to the itinerary page
          router.push(returnUrl);
        } else {
          router.push("/");
        }
      } else {
        setAlertText(t("loginErrorAlert"));
        setShowAlert(true);
      }

      setIsLoggingIn(false);
    },
  });

  const onSubmit: SubmitHandler<LogInFormEmailData> = useCallback(
    async (data) => {
      setIsLoggingIn(true);
      setAlertText("");
      setShowAlert(false);

      try {
        await loginViaEmail.mutateAsync(data);
      } catch (error) {
        if (error instanceof TRPCClientError) {
          setAlertText(error.message ?? t("loginErrorAlert"));
          setShowAlert(true);
        }
      } finally {
        setIsLoggingIn(false);
      }
    },
    [loginViaEmail, t],
  );

  return (
    <LoginEmailContext.Provider
      value={{
        control,
        handleSubmit,
        errors,
        email,
        password,
        onSubmit,
      }}
    >
      {children}
    </LoginEmailContext.Provider>
  );
};
