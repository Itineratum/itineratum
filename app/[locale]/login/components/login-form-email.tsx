"use client";

import { trpc } from "@/app/_trpc/client";
import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import Text from "@/components/atoms/text";
import apiEndpointsConst from "@/constants/api/endpoints.json";
import { LoginType } from "@/constants/enums/loginType";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { LogInFormEmailData } from "@/constants/types/logInFormData";
import { postRequest } from "@/utils/apiRequest";
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
  const t = useTranslations();
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

  const res = trpc.user.generateVerificationCode.useQuery({email: "string"});

  const onSubmit: SubmitHandler<LogInFormEmailData> = async (data) => {
    setIsLoggingIn(true);
    setAlertText("");
    setShowAlert(false);
    const { email, password } = data;
    const bodyJson = {
      email,
      password,
      type: LoginType.viaEmail,
    };
    const loginRes = await postRequest(apiEndpointsConst.login, bodyJson);

    if (loginRes.ok) {
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
        setAlertText(t("login.loginForm.loginErrorAlert"));
        setShowAlert(true);
      }
    } else {
      const error = await loginRes.json();
      setAlertText(error.message ?? t("login.loginForm.loginErrorAlert"));
      setShowAlert(true);
      console.log("Error!", error);
    }

    setIsLoggingIn(false);
  };

  const emailField = () => {
    return (
      <Controller
        key={emailId}
        name={emailId}
        control={control}
        defaultValue=""
        rules={{
          required: t("login.loginForm.emailError"),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            variant="filled"
            sx={formFieldStyling}
            margin={formFieldMargin}
            label={t("login.loginForm.email")}
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
          required: t("login.loginForm.passwordError"),
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
            label={t("login.loginForm.password")}
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
          text={t("login.loginForm.loginUsingPhoneNumber")}
          variant={TypographyVariant.h5}
          bold={false}
          textDecoration={TypographyTextDecoration.underline}
        />
      </Box>
    );
  };

  const loginButton = () => {
    const buttonWidth: string = "30%";
    const loadingAnimationSize: number = 24;

    const handleOnClick = async () => {
      console.log(res.data);
    }

    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          // type="submit"
          onClick={handleOnClick}
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
              text={t("login.loginForm.login")}
              variant={TypographyVariant.h4}
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
