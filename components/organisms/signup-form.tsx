"use client";

import Text from "@/components/atoms/text";
import { countryInfoList } from "@/constants/enums/country";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import urlConst from "@/constants/urls.json";
import {
  validateEmail,
  validatePhoneNumber,
} from "@/utils/signUpFormValidation";
import { Box, Button, Divider, Grid, MenuItem, TextField } from "@mui/material";
import { CountryCode } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

const SignUpForm = () => {
  const t = useTranslations();
  const countryFieldId: string = "country-field";
  const countryCodeFieldId: string = "country-code-field";
  const numberFieldId: string = "number-field";
  const emailFieldId: string = "email-field";
  const passwordFieldId: string = "password-field";
  const reEnterPasswordFieldId: string = "reenter-password-field";

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

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [country, setCountry] = useState<string>("");
  const [countryIso2, setCountryIso2] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [phoneNumberhelperText, setPhoneNumberHelperText] =
    useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailHelperText, setEmailHelperText] = useState<string>("");

  const executeValidatePhoneNumber = (phoneNumber: string) => {
    validatePhoneNumber(
      phoneNumber,
      countryIso2 as CountryCode,
      setPhoneNumberError,
      setPhoneNumberHelperText,
      t("signUp.signUpForm.numberError"),
    );
  };

  useEffect(() => {
    if (countryCode) {
      executeValidatePhoneNumber(phoneNumber);
    }
  }, [countryCode]);

  const handleSubmit = () => {};

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

      const handleCountryChange = (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => {
        const selectedCountry = event.target.value;
        setCountry(selectedCountry);

        try {
          const callingCode =
            countryInfoList[selectedCountry as CountryCode].callingCode;
          setCountryCode(callingCode);
          setCountryIso2(selectedCountry);
        } catch (error) {
          setCountryCode("");
          setCountryIso2("");
        }
      };

      return (
        <TextField
          select
          required
          fullWidth
          id={countryFieldId}
          variant="filled"
          sx={formFieldStyling}
          margin={formFieldMargin}
          label={t("signUp.signUpForm.country")}
          value={country}
          onChange={handleCountryChange}
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
      );
    };

    const phoneNumberSection = () => {
      const countryCodeWidth: number = 4;
      const numberWidth: number = 12 - countryCodeWidth;

      const handlePhoneNumberChange = (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => {
        const inputPhoneNumber = event.target.value;
        setPhoneNumber(inputPhoneNumber);
        executeValidatePhoneNumber(inputPhoneNumber);
      };

      const countryCodeField = () => {
        return (
          <TextField
            required
            fullWidth
            id={countryCodeFieldId}
            variant="filled"
            sx={formFieldStyling}
            margin={formFieldMargin}
            label={t("signUp.signUpForm.countryCode")}
            value={countryCode}
            InputProps={{ readOnly: true }}
            InputLabelProps={{ sx: { color: "text.primary" } }}
          />
        );
      };

      const numberField = () => {
        return (
          <TextField
            required
            fullWidth
            id={numberFieldId}
            variant="filled"
            sx={formFieldStyling}
            margin={formFieldMargin}
            label={t("signUp.signUpForm.number")}
            value={phoneNumber}
            InputLabelProps={{ sx: { color: "text.primary" } }}
            onChange={handlePhoneNumberChange}
            error={phoneNumberError}
            helperText={phoneNumberhelperText}
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

      const handleClick = () => {
        setPageNumber(2);
      };

      return (
        <Button
          type="submit"
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
      const handleEmailChange = (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => {
        const inputEmail = event.target.value;
        setEmail(inputEmail);
        validateEmail(
          email,
          setEmailError,
          setEmailHelperText,
          t("signUp.signUpForm.emailError"),
        );
      };

      return (
        <TextField
          required
          fullWidth
          id={emailFieldId}
          variant="filled"
          sx={formFieldStyling}
          margin={formFieldMargin}
          label={t("signUp.signUpForm.email")}
          value={email}
          InputLabelProps={{ sx: { color: "text.primary" } }}
          onChange={handleEmailChange}
          error={emailError}
          helperText={emailHelperText}
        />
      );
    };

    const passwordField = () => {
      return <Box></Box>;
    };

    const reEnterPasswordField = () => {
      return <Box></Box>;
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
      onSubmit={handleSubmit}
      noValidate
      marginTop={formMargin}
    >
      {pageNumber === 1 ? page1() : page2()}
      {divider()}
    </Box>
  );
};

export default SignUpForm;
