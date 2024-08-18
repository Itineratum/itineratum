"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import urlConst from "@/constants/urls.json";
import { InputLabel, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { getCountryDataList } from "countries-list";
import { useTranslations } from "next-intl";

const Login = () => {
  const t = useTranslations();
  const countryFieldId = "country-field";
  const numberFieldId = "number-field";
  const countries = getCountryDataList();
  const color = colorsConst.components.textField;
  const formMargin: number = 2;

  // TODO
  const handleSubmit = () => {};

  const loginOrSignUpText = () => {
    return (
      <Box marginBottom={5}>
        <Text
          text={t("login.loginOrSignup")}
          variant={TypographyVariant.h3}
          bold={true}
        />
      </Box>
    );
  };
  const welcomeTravellerText = () => {
    return (
      <Box sx={{ textAlign: "left", width: "100%" }}>
        <Text
          text={t("login.welcome")}
          variant={TypographyVariant.h3}
          bold={true}
        />
      </Box>
    );
  };
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
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loginOrSignUpText()}
        {welcomeTravellerText()}
      </Box>
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
    </Container>
  );
};

export default Login;
