"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTranslations } from "next-intl";
import SignUpForm from "../../app/[locale]/sign-up/components/signup-form";

const SignUpPage = () => {
  const t = useTranslations("signUp");

  const signUpText = () => {
    return (
      <Box marginBottom={5}>
        <Text
          text={t("signUp")}
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
          text={t("welcome")}
          variant={TypographyVariant.h3}
          bold={true}
        />
      </Box>
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
        {signUpText()}
        {welcomeTravellerText()}
      </Box>
      <SignUpForm />
    </Container>
  );
};

export default SignUpPage;
