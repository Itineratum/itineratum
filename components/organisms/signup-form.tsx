"use client";

import Text from "@/components/atoms/text";
import { countryInfoList } from "@/constants/enums/country";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import urlConst from "@/constants/urls.json";
import { Box, Button, Divider, Grid, MenuItem, TextField } from "@mui/material";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

const SignUpForm = () => {
  const t = useTranslations();
  const countryFieldId: string = "country-field";
  const countryCodeFieldId: string = "country-code-field";
  const numberFieldId: string = "number-field";

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

  const [country, setCountry] = useState<string>("");
  const [countryIso2, setCountryIso2] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleSubmit = () => {};

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
        label={t("login.loginForm.country")}
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
    const [error, setError] = useState<boolean>(false);
    const [helperText, setHelperText] = useState<string>("");

    useEffect(() => {
      if (countryCode) {
        validatePhoneNumber(phoneNumber);
      }
    }, [countryCode]);

    const validatePhoneNumber = (number: string) => {
      const onError = () => {
        setError(true);
        setHelperText(t("login.loginForm.numberError"));
      };

      try {
        if (!isValidPhoneNumber(number, countryIso2 as CountryCode)) {
          onError();
        } else {
          setError(false);
          setHelperText("");
        }
      } catch (error) {
        onError();
      }
    };

    const handlePhoneNumberChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const inputPhoneNumber = event.target.value;
      setPhoneNumber(inputPhoneNumber);
      validatePhoneNumber(inputPhoneNumber);
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
          label={t("login.loginForm.countryCode")}
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
          label={t("login.loginForm.number")}
          value={phoneNumber}
          InputLabelProps={{ sx: { color: "text.primary" } }}
          onChange={handlePhoneNumberChange}
          error={error}
          helperText={helperText}
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

  const privacyPolicyLink = () => {
    return (
      <Box sx={{ textAlign: "left", width: "100%" }}>
        <Link
          href={urlConst.privacyPolicy}
          color="text.primary"
          target="_blank"
        >
          <Text
            text={t("login.loginForm.privacyPolicy")}
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Link>
      </Box>
    );
  };

  const signUpButton = () => {
    const buttonWidth: string = "40%";

    return (
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: formMargin, mb: formMargin, maxWidth: buttonWidth }}
      >
        <Text
          text={t("login.loginForm.signUp")}
          variant={TypographyVariant.h4}
          bold={false}
        />
      </Button>
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
            text={t("login.loginForm.or")}
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
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {countryField()}
      {phoneNumberSection()}
      {privacyPolicyLink()}
      {signUpButton()}
      {divider()}
    </Box>
  );
};

export default SignUpForm;
