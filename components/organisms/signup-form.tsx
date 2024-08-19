"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import urlConst from "@/constants/urls.json";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { getCountryDataList } from "countries-list";
import {
  CountryCode,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

const SignUpForm = () => {
  const t = useTranslations();
  const countryFieldId = "country-field";
  const numberFieldId = "number-field";
  const countries = getCountryDataList();
  const color = colorsConst.components.textField;
  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";
  const formFieldBorderRadius: number = 2;
  const formFieldStyling: Object = {
    backgroundColor: color.backgroundColor,
    borderRadius: formFieldBorderRadius,
    "& .MuiFilledInput-root": {
      borderRadius: formFieldBorderRadius, // ensure the filled area is rounded
      "&:before, &:after": {
        borderBottom: "none", // remove the underline when the text field is being clicked on
      },
    },
    "& .MuiInputBase-input": {
      borderRadius: formFieldBorderRadius, // ensure the input text area is rounded
    },
  };
  const [country, setCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // TODO
  const handleSubmit = () => {};

  const countryField = () => {
    const dropdownHeight: number = 200;

    const handleCountryChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const country = event.target.value;
      setCountry(country);

      try {
        const callingCode = getCountryCallingCode(country as CountryCode);
        setPhoneNumber(`+${callingCode} `);
      } catch (error) {
        setPhoneNumber("");
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
        {countries.map((country) => (
          <MenuItem key={country.name} value={country.iso2}>
            {country.name}
          </MenuItem>
        ))}
      </TextField>
    );
  };
  const numberField = () => {
    const [error, setError] = useState<boolean>(false);
    const [helperText, setHelperText] = useState<string>("");

    const handlePhoneNumberChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const inputPhoneNumber = event.target.value;
      setPhoneNumber(inputPhoneNumber);

      const onError = () => {
        setError(true);
        setHelperText(t("login.loginForm.numberError"));
      };

      try {
        if (!isValidPhoneNumber(inputPhoneNumber, country as CountryCode)) {
          onError();
        } else {
          setError(false);
          setHelperText("");
        }
      } catch (error) {
        onError();
      }
    };

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
      {numberField()}
      {privacyPolicyLink()}
      {signUpButton()}
    </Box>
  );
};

export default SignUpForm;
