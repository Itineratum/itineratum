"use client";

import { trpc } from "@/app/_trpc/client";
import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { LogInFormEmailData } from "@/constants/types/logInFormData";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

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

  const onSubmit: SubmitHandler<LogInFormEmailData> = async (data) => {
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
  };

  const emailField = () => {
    return (
      <Controller
        key={emailId}
        name={emailId}
        control={control}
        defaultValue=""
        rules={{
          required: t("emailError"),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            variant="filled"
            sx={formFieldStyling}
            margin={formFieldMargin}
            label={t("email")}
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

  const passwordField = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
      <Controller
        key={passwordId}
        name={passwordId}
        control={control}
        defaultValue=""
        rules={{
          required: t("passwordError"),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            variant="filled"
            sx={formFieldStyling}
            margin={formFieldMargin}
            label={t("password")}
            value={password}
            InputLabelProps={{
              sx: { color: "text.primary" },
            }}
            error={!!errors.password}
            helperText={
              errors.password ? (errors.password.message as string) : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
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
      {showAlert ? <Alert severity="error">{alertText}</Alert> : <></>}
    </Box>
  );
};
