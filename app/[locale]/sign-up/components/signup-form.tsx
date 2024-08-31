"use client";

import { countryInfoList } from "@/constants/enums/country";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import urlConst from "@/constants/urls.json";
import { isValidEmail, isValidPassword } from "@/utils/signUpFormValidation";
import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  MenuItem,
  TextField,
} from "@mui/material";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import { ChangeEvent, useState } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useForm,
} from "react-hook-form";
import Text from "../../../../components/atoms/text";

const SignUpForm = () => {
  const t = useTranslations();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm();

  const [pageNumber, setPageNumber] = useState<number>(1);
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

  const countryId = "country";
  const countryCodeId = "countryCode";
  const numberId = "number";
  const emailId = "email";
  const passwordId = "password";
  const reEnterPasswordId = "reEnterPassword";

  const country = watch(countryId);
  const number = watch(numberId);
  const email = watch(emailId);
  const password = watch(passwordId);
  const reEnterPassword = watch(reEnterPasswordId);

  const privacyPolicyLink = () => {
    return (
      <Box sx={{ textAlign: "left", width: "100%" }}>
        <Link
          href={urlConst.privacyPolicy}
          color="text.primary"
          target="_blank"
        >
          <Text
            text={t("signUp.signUpForm.privacyPolicy")}
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Link>
      </Box>
    );
  };

  const page1 = () => {
    const countryField = () => {
      const dropdownHeight: number = 200;

      const handleCountryChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<FieldValues, "country">,
      ) => {
        field.onChange(event);
        const inputCountry = event.target.value;

        try {
          const callingCode =
            countryInfoList[inputCountry as CountryCode].callingCode;
          setValue(countryCodeId, callingCode);
          await trigger(countryId);

          if (number) await trigger(numberId);
        } catch (error) {
          setValue(countryCodeId, "");
        }
      };

      return (
        <Controller
          key={countryId}
          name={countryId}
          control={control}
          defaultValue=""
          rules={{ required: t("signUp.signUpForm.countryError") }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              required
              fullWidth
              variant="filled"
              sx={formFieldStyling}
              margin={formFieldMargin}
              label={t("signUp.signUpForm.country")}
              value={country}
              error={!!errors.country}
              helperText={
                errors.country ? (errors.country.message as string) : ""
              }
              onChange={async (event) =>
                await handleCountryChange(event, field)
              }
              InputLabelProps={{ sx: { color: "text.primary" } }}
              SelectProps={{
                MenuProps: {
                  MenuListProps: {
                    sx: { maxHeight: dropdownHeight, overflowY: "auto" },
                  },
                },
              }}
            >
              {Object.values(countryInfoList).map((country) => (
                <MenuItem key={country.name} value={country.iso2}>
                  {`${country.name} ${country.flagEmoji}`}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      );
    };

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
                label={t("signUp.signUpForm.countryCode")}
                value={countryCode}
                InputProps={{ readOnly: true }}
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
          const isValid = isValidPhoneNumber(numberInput, country);
          return isValid ? true : t("signUp.signUpForm.numberError");
        };

        const handleNumberChange = async (
          event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          field: ControllerRenderProps<FieldValues, "number">,
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
              validate: numberValidation,
              required: t("signUp.signUpForm.numberError"),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                sx={formFieldStyling}
                margin={formFieldMargin}
                label={t("signUp.signUpForm.number")}
                value={number}
                InputLabelProps={{
                  sx: { color: "text.primary" },
                }}
                error={!!errors.number}
                helperText={
                  errors.number ? (errors.number.message as string) : ""
                }
                onChange={async (event) =>
                  await handleNumberChange(event, field)
                }
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

    const nextButton = () => {
      const buttonWidth: string = "30%";

      const handleClick = async () => {
        const isCountryValid = await trigger(countryId);
        const isNumberValid = await trigger(numberId);

        if (isCountryValid && isNumberValid) setPageNumber(2);
      };

      return (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth, ml: "auto" }}
          onClick={handleClick}
        >
          <Text
            text={t("signUp.signUpForm.next")}
            variant={TypographyVariant.h4}
            bold={false}
          />
        </Button>
      );
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {countryField()}
        {phoneNumberSection()}
        {privacyPolicyLink()}
        {nextButton()}
      </Box>
    );
  };

  const page2 = () => {
    const emailField = () => {
      const emailValidation = (emailInput: string) => {
        const isValid = isValidEmail(emailInput);
        return isValid ? true : t("signUp.signUpForm.emailError");
      };

      const handleEmailChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<FieldValues, "email">,
      ) => {
        field.onChange(event.target.value);
        await trigger(emailId);
      };

      return (
        <Controller
          key={emailId}
          name={emailId}
          control={control}
          defaultValue=""
          rules={{
            validate: emailValidation,
            required: t("signUp.signUpForm.emailError"),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              variant="filled"
              sx={formFieldStyling}
              margin={formFieldMargin}
              label={t("signUp.signUpForm.email")}
              value={email}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.email}
              helperText={errors.email ? (errors.email.message as string) : ""}
              onChange={async (event) => await handleEmailChange(event, field)}
            />
          )}
        />
      );
    };

    const passwordField = () => {
      const passwordValidation = (passwordInput: string) => {
        const isValid = isValidPassword(passwordInput);
        return isValid ? true : t("signUp.signUpForm.passwordError");
      };

      const handlePasswordChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<FieldValues, "password">,
      ) => {
        field.onChange(event.target.value);
        await trigger(passwordId);
      };

      return (
        <Controller
          key={passwordId}
          name={passwordId}
          control={control}
          defaultValue=""
          rules={{
            validate: passwordValidation,
            required: t("signUp.signUpForm.passwordError"),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              variant="filled"
              sx={formFieldStyling}
              margin={formFieldMargin}
              label={t("signUp.signUpForm.password")}
              value={password}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.password}
              helperText={
                errors.password ? (errors.password.message as string) : ""
              }
              multiline
              onChange={async (event) =>
                await handlePasswordChange(event, field)
              }
              FormHelperTextProps={{ sx: { whiteSpace: "pre-line" } }} // ensures that newline characters (\n) are rendered as actual line breaks
            />
          )}
        />
      );
    };

    const reEnterPasswordField = () => {
      const reEnterPasswordValidation = (reEnterPasswordInput: string) => {
        const isValid =
          reEnterPasswordInput === password &&
          isValidPassword(reEnterPasswordInput);
        return isValid ? true : t("signUp.signUpForm.reEnterPasswordError");
      };

      const handleReEnterPasswordChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<FieldValues, "reEnterPassword">,
      ) => {
        field.onChange(event.target.value);
        await trigger(reEnterPasswordId);
      };

      return (
        <Controller
          key={reEnterPasswordId}
          name={reEnterPasswordId}
          control={control}
          defaultValue=""
          rules={{
            validate: reEnterPasswordValidation,
            required: t("signUp.signUpForm.reEnterPasswordError"),
          }}
          disabled={!isValidPassword(password)}
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              variant="filled"
              sx={formFieldStyling}
              margin={formFieldMargin}
              label={t("signUp.signUpForm.reEnterPassword")}
              value={reEnterPassword}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.reEnterPassword}
              helperText={
                errors.reEnterPassword
                  ? (errors.reEnterPassword.message as string)
                  : ""
              }
              onChange={async (event) =>
                await handleReEnterPasswordChange(event, field)
              }
            />
          )}
        />
      );
    };

    return (
      <Box>
        {emailField()}
        {passwordField()}
        {reEnterPasswordField()}
      </Box>
    );
  };

  const divider = () => {
    const gapBetweenLines: number = 4;
    const lineThickness: number = 3;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          my: formMargin,
        }}
      >
        <Divider
          sx={{
            flexGrow: 1,
            borderBottomWidth: lineThickness,
            borderBottomColor: "text.primary",
          }}
        />
        <Box
          sx={{
            mx: gapBetweenLines,
            color: "text.primary",
            fontWeight: "bold",
          }}
        >
          <Text
            text={t("signUp.signUpForm.or")}
            variant={TypographyVariant.h3}
            bold={true}
          />
        </Box>
        <Divider
          sx={{
            flexGrow: 1,
            borderBottomWidth: lineThickness,
            borderBottomColor: "text.primary",
          }}
        />
      </Box>
    );
  };

  return (
    <Box
      component="form"
      // onSubmit={handleSubmit}
      noValidate
      marginTop={formMargin}
    >
      {pageNumber === 1 ? page1() : page2()}
      {divider()}
    </Box>
  );
};

export default SignUpForm;
