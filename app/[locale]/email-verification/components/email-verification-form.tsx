"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { VerificationCodeFormData } from "@/constants/types/verificationCodeFormData";
import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import colorsConst from "@/constants/pages/colors.json";

const EmailVerificationForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerificationCodeFormData>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const color = colorsConst.components.textField;
  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";
  const formFieldBorderRadius: number = 2;
  const formFieldStyling: Object = {
    backgroundColor: color.backgroundColor,
    borderRadius: formFieldBorderRadius,
    "& .MuiFilledInput-root": {
      borderRadius: formFieldBorderRadius,
      "&:before, &:after": {
        borderBottom: "none",
      },
    },
    "& .MuiInputBase-input": {
      borderRadius: formFieldBorderRadius,
    },
  };

  const emailId = "email";
  const verificationCodeId = "verificationCode";

  const email = watch(emailId);
  const verificationCode = watch(verificationCodeId);

  const onSubmit: SubmitHandler<VerificationCodeFormData> = async (data) => {
    // TODO:
    console.log("HELLO");
  };

  const emailField = () => {
    return (
      <Controller
        key={emailId}
        name={emailId}
        control={control}
        defaultValue=""
        rules={{
          required: t("emailVerification.emailVerificationForm.emailError"),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            variant="filled"
            sx={formFieldStyling}
            margin={formFieldMargin}
            label={t("emailVerification.emailVerificationForm.email")}
            value={email}
            InputLabelProps={{
              sx: { color: "text.primary" },
            }}
            error={!!errors.email}
            helperText={errors.email ? (errors.email.message as string) : ""}
          />
        )}
      />
    );
  };

  const verificationCodeField = () => {
    return (
      <Controller
        key={verificationCodeId}
        name={verificationCodeId}
        control={control}
        defaultValue=""
        rules={{
          required: t(
            "emailVerification.emailVerificationForm.verificationCodeError",
          ),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            variant="filled"
            sx={formFieldStyling}
            margin={formFieldMargin}
            label={t(
              "emailVerification.emailVerificationForm.verificationCode",
            )}
            value={verificationCode}
            InputLabelProps={{
              sx: { color: "text.primary" },
            }}
            error={!!errors.verificationCode}
            helperText={
              errors.verificationCode
                ? (errors.verificationCode.message as string)
                : ""
            }
          />
        )}
      />
    );
  };

  const verifyButton = () => {
    const buttonWidth: string = "30%";
    const loadingAnimationSize: number = 24;

    return (
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ my: formMargin, maxWidth: buttonWidth, ml: "auto" }}
        color="primary"
        disabled={isVerifying}
      >
        {isVerifying ? (
          <CircularProgress size={loadingAnimationSize} />
        ) : (
          <Text
            text={t("emailVerification.emailVerificationForm.verify")}
            variant={TypographyVariant.h4}
            bold={false}
          />
        )}
      </Button>
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
      {verificationCodeField()}
      {verifyButton()}
      {showAlert ? <Alert severity="error">{alertText}</Alert> : <></>}
    </Box>
  );
};

export default EmailVerificationForm;
