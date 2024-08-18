"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import urlConst from "@/constants/urls.json";
import { Box, Button, InputLabel, MenuItem, TextField } from "@mui/material";
import { getCountryDataList } from "countries-list";
import { useTranslations } from "next-intl";
import Link from "next/link";

const SignUpForm = () => {
  const t = useTranslations();
  const countryFieldId = "country-field";
  const numberFieldId = "number-field";
  const countries = getCountryDataList();
  const color = colorsConst.components.textField;
  const formMargin: number = 2;

  // TODO
  const handleSubmit = () => {};

  const countryField = () => {
    return (
      <Box marginTop={formMargin} sx={{ width: "100%" }}>
        <InputLabel id={countryFieldId} sx={{ color: "text.primary" }}>
          {t("login.loginForm.country")}
        </InputLabel>
        <TextField
          select
          required
          fullWidth
          id={countryFieldId}
          sx={{
            backgroundColor: color.backgroundColor,
          }}
          SelectProps={{
            MenuProps: {
              MenuListProps: {
                sx: { maxHeight: 200, overflowY: "auto" },
              },
            },
          }}
        >
          {countries.map((country) => (
            <MenuItem key={country.name} value={country.name}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    );
  };
  const numberField = () => {
    return (
      <Box marginTop={formMargin} sx={{ width: "100%" }}>
        <InputLabel id={numberFieldId} sx={{ color: "text.primary" }}>
          {t("login.loginForm.number")}
        </InputLabel>
        <TextField
          required
          fullWidth
          id={numberFieldId}
          sx={{ backgroundColor: color.backgroundColor }}
        />
      </Box>
    );
  };
  const privacyPolicyLink = () => {
    return (
      <Box marginTop={formMargin} sx={{ textAlign: "left", width: "100%" }}>
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
    return (
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: formMargin, mb: formMargin, maxWidth: "40%" }}
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
