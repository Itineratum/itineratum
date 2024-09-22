"use client";

import { LogInFormEmail } from "@/app/[locale]/login/components/login-form-email";
import { LogInFormOtp } from "@/app/[locale]/login/components/login-form-otp";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Collapse } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { OrDivider } from "../atoms/or-divider";
import { ContinueWithGoogleButton } from "../molecules/continue-with-google-button";

const LoginPage = () => {
  const t = useTranslations("login");
  const [isLoginUsingOtp, setIsLoginUsingOtp] = useState<boolean>(false);

  const pageTransitionDuration: number = 500;
  const formMargin: number = 2;

  const loginText = () => {
    return (
      <Box marginBottom={5}>
        <Text text={t("login")} variant={TypographyVariant.h5} bold={true} />
      </Box>
    );
  };

  const welcomeTravellerText = () => {
    return (
      <Box sx={{ textAlign: "left", width: "100%" }}>
        <Text text={t("welcome")} variant={TypographyVariant.h5} bold={true} />
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
        {loginText()}
        {welcomeTravellerText()}
      </Box>
      <Collapse in={isLoginUsingOtp} timeout={pageTransitionDuration}>
        <LogInFormOtp setIsLoginUsingOtp={setIsLoginUsingOtp} />
      </Collapse>
      <Collapse in={!isLoginUsingOtp} timeout={pageTransitionDuration}>
        <LogInFormEmail setIsLoginUsingOtp={setIsLoginUsingOtp} />
      </Collapse>
      <OrDivider formMargin={formMargin} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ContinueWithGoogleButton formMargin={formMargin} />
      </Box>
    </Container>
  );
};

export default LoginPage;
