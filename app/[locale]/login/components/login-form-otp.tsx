"use client";

import { trpc } from "@/app/_trpc/client";
import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { countryInfoList } from "@/constants/enums/country";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { LogInFormOtpData } from "@/constants/types/formData/logInFormData";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
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
  const t = useTranslations("login.loginForm");
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    trigger,
  } = useForm<LogInFormOtpData>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";

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

  const phoneNumberSection = () => {
    const countryCodeWidth: number = 4;
    const numberWidth: number = 12 - countryCodeWidth;

    const countryCodeField = () => {
      const countryCode = getValues(countryCodeId);
      const countryCodeFilled = Boolean(countryCode);
      const dropdownHeight: number = 200;

      const handleCountryCodeChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<LogInFormOtpData, "countryCode">,
      ) => {
        field.onChange(event);
        const inputCountryCode = event.target.value;
        const countryIso2 = Object.values(countryInfoList).find(
          (country) => country.callingCode === inputCountryCode,
        )?.iso2;
        setValue(countryId, countryIso2!);

        await trigger(countryCodeId);
        if (number) await trigger(numberId);
      };

      return (
        <Controller
          key={countryCodeId}
          name={countryCodeId}
          control={control}
          defaultValue=""
          rules={{ required: t("countryCodeError") }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              required
              fullWidth
              variant="filled"
              margin={formFieldMargin}
              label={t("countryCode")}
              value={countryCode}
              error={!!errors.countryCode}
              helperText={
                errors.countryCode ? (errors.countryCode.message as string) : ""
              }
              onChange={async (event) =>
                await handleCountryCodeChange(event, field)
              }
              InputLabelProps={{
                sx: { color: "text.primary" },
                shrink: countryCodeFilled,
              }}
              SelectProps={{
                MenuProps: {
                  MenuListProps: {
                    sx: { maxHeight: dropdownHeight, overflowY: "auto" },
                  },
                },
              }}
            >
              {Object.values(countryInfoList).map((country) => (
                <MenuItem key={country.name} value={country.callingCode}>
                  {`${country.iso2} ${country.flagEmoji} (${country.callingCode})`}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      );
    };

    const numberField = () => {
      const numberValidation = (numberInput: string) => {
        const isValid = isValidPhoneNumber(numberInput, country as CountryCode);
        return isValid ? true : t("numberError");
      };

      const handleNumberChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<LogInFormOtpData, "number">,
      ) => {
        field.onChange(event.target.value);
        await trigger(numberId);
      };

      const getOtpButton = () => {
        const handleClick = async () => {
          // TODO: set up login with OTP in the future?

          const isNumberValid = await trigger(numberId);

          if (isNumberValid) {
            const phoneNumber = `${countryCode}${number}`;
            const data = {
              phoneNumber,
            };

            try {
              await loginViaOtp.mutateAsync(data);
            } catch (error) {
              if (error instanceof TRPCClientError) {
              }
            } finally {
            }
          }
        };

        return (
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ whiteSpace: "nowrap" }}
            color="secondary"
            onClick={handleClick}
          >
            <Text
              text={t("getOtp")}
              variant={TypographyVariant.button}
              bold={false}
            />
          </Button>
        );
      };

      return (
        <Controller
          key={numberId}
          name={numberId}
          control={control}
          defaultValue=""
          rules={{
            validate: numberValidation,
            required: t("numberError"),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              variant="filled"
              margin={formFieldMargin}
              label={t("number")}
              value={number}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.number}
              helperText={
                errors.number ? (errors.number.message as string) : ""
              }
              onChange={async (event) => await handleNumberChange(event, field)}
              InputProps={{
                endAdornment: <Box>{getOtpButton()}</Box>,
              }}
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
          required: t("otpError"),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            variant="filled"
            margin={formFieldMargin}
            label={t("otp")}
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
          text={t("loginUsingEmail")}
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
      {phoneNumberSection()}
      {otpField()}
      <Box sx={{ display: "flex" }}>
        <PrivacyPolicyLink />
        {loginUsingEmailButton()}
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
