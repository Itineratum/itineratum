"use client";

import { trpc } from "@/app/_trpc/client";
import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import TextInputField from "@/components/molecules/text-input-field";
import { AlertType } from "@/constants/enums/alertType";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { LogInFormEmailData } from "@/constants/types/formData/logInFormData";
import { Box, Button, CircularProgress } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const LogInFormEmail = ({
  setIsLoginUsingOtp,
}: {
  setIsLoginUsingOtp: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("login.loginForm");
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LogInFormEmailData>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const formMargin: number = 2;

  const emailId = "email";
  const passwordId = "password";

  const email = watch(emailId);
  const password = watch(passwordId);

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
        router.push("/");
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

  const emailField = () => {
    return (
      <TextInputField
        name={emailId}
        label={t("email")}
        control={control}
        errorMessage={t("emailError")}
        errors={errors}
        value={email}
      />
    );
  };

  const passwordField = () => {
    return (
      <TextInputField
        name={passwordId}
        label={t("password")}
        control={control}
        errorMessage={t("passwordError")}
        errors={errors}
        value={password}
        isPasswordInputField={true}
      />
    );
  };

  const loginUsingPhoneNumberButton = () => {
    const handleOnClick = () => {
      setIsLoginUsingOtp(true);
    };

    return (
      <Box
        sx={{ textAlign: "right", width: "100%", cursor: "pointer" }}
        onClick={handleOnClick}
      >
        <Text
          text={t("loginUsingPhoneNumber")}
          variant={TypographyVariant.subtitle2}
          bold={false}
          textDecoration={TypographyTextDecoration.underline}
        />
      </Box>
    );
  };

  const loginButton = () => {
    const buttonWidth: string = "30%";
    const loadingAnimationSize: number = 24;

    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth }}
          color="primary"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <CircularProgress size={loadingAnimationSize} />
          ) : (
            <Text
              text={t("login")}
              variant={TypographyVariant.button}
              bold={false}
            />
          )}
        </Button>
      </Box>
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      marginTop={formMargin}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {emailField()}
      {passwordField()}
      <Box sx={{ display: "flex" }}>
        <PrivacyPolicyLink />
        {loginUsingPhoneNumberButton()}
      </Box>
      {loginButton()}
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertType={AlertType.error}
        alertText={alertText}
      />
    </Box>
  );
};
