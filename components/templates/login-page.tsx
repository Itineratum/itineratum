"use client";

import { LogInFormEmail } from "@/app/[locale]/login/components/login-form-email";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Collapse } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTranslations } from "next-intl";
import { useState } from "react";

const LoginPage = () => {
  const t = useTranslations();
  const [isLoginUsingOtp, setIsLoginUsingOtp] = useState<boolean>(false);

  const pageTransitionDuration: number = 500;

  const loginText = () => {
    return (
      <Box marginBottom={5}>
        <Text
          text={t("login.login")}
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
        // TODO:
        {}
      </Collapse>
      <Collapse in={!isLoginUsingOtp} timeout={pageTransitionDuration}>
        <LogInFormEmail />
      </Collapse>
    </Container>
  );
};

export default LoginPage;
