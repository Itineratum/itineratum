"use client";

import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import Text from "@/components/atoms/text";
import apiEndpointsConst from "@/constants/api/endpoints.json";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import {
  LogInFormEmailData,
  LogInFormOtpData,
} from "@/constants/types/logInFormData";
import { postRequest } from "@/utils/apiRequest";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import {
  Controller,
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from "react-hook-form";

export const LogInFormOtp = ({
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
    getValues,
    watch,
    trigger,
  } = useForm<LogInFormOtpData>();

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

  const countryCodeId = "countryCode";
  const numberId = "number";
  const otpId = "otp";

  const countryCode = watch(countryCodeId);
  const number = watch(numberId);
  const otp = watch(otpId);

  const onSubmit: SubmitHandler<LogInFormOtpData> = async (data) => {};

  const phoneNumberSection = () => {
    const countryCodeWidth: number = 4;
    const numberWidth: number = 12 - countryCodeWidth;

    const countryCodeField = () => {
      const countryCode = getValues(countryCodeId);
      const countryCodeFilled = Boolean(countryCode);

      return (
        <Controller
          key={countryCodeId}
          name={countryCodeId}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              variant="filled"
              sx={formFieldStyling}
              margin={formFieldMargin}
              label={t("login.loginForm.countryCode")}
              value={countryCode}
              InputLabelProps={{
                sx: { color: "text.primary" },
                shrink: countryCodeFilled,
              }}
            />
          )}
        />
      );
    };

    const numberField = () => {
      const numberValidation = (numberInput: string) => {
        // const isValid = isValidPhoneNumber(
        //   numberInput,
        //   country as CountryCode,
        // );
        // return isValid ? true : t("signUp.signUpForm.numberError");
      };

      const handleNumberChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<LogInFormOtpData, "number">,
      ) => {
        field.onChange(event.target.value);
        await trigger(numberId);
      };

      return (
        <Controller
          key={numberId}
          name={numberId}
          control={control}
          defaultValue=""
          rules={{
            // validate: numberValidation,
            required: t("login.loginForm.numberError"),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              variant="filled"
              sx={formFieldStyling}
              margin={formFieldMargin}
              label={t("login.loginForm.number")}
              value={number}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.number}
              helperText={
                errors.number ? (errors.number.message as string) : ""
              }
              onChange={async (event) => await handleNumberChange(event, field)}
            />
          )}
        />
      );
    };

    return (
      <Grid container spacing={2}>
        <Grid item xs={countryCodeWidth}>
          {countryCodeField()}
        </Grid>
        <Grid item xs={numberWidth}>
          {numberField()}
        </Grid>
      </Grid>
    );
  };

  const otpField = () => {
    return (
      <Controller
        key={otpId}
        name={otpId}
        control={control}
        defaultValue=""
        rules={{
          required: t("login.loginForm.otpError"),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            variant="filled"
            sx={formFieldStyling}
            margin={formFieldMargin}
            label={t("login.loginForm.otp")}
            value={otp}
            InputLabelProps={{
              sx: { color: "text.primary" },
            }}
            error={!!errors.otp}
            helperText={errors.otp ? (errors.otp.message as string) : ""}
          />
        )}
      />
    );
  };

  const loginUsingEmailButton = () => {
    const handleOnClick = () => {
      setIsLoginUsingOtp(false);
    };

    return (
      <Box
        sx={{ textAlign: "right", width: "100%", cursor: "pointer" }}
        onClick={handleOnClick}
      >
        <Text
          text={t("login.loginForm.loginUsingEmail")}
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
      {phoneNumberSection()}
      {otpField()}
      <Box sx={{ display: "flex" }}>
        <PrivacyPolicyLink />
        {loginUsingEmailButton()}
      </Box>
      {loginButton()}
      {showAlert ? <Alert severity="error">{alertText}</Alert> : <></>}
    </Box>
  );
};
