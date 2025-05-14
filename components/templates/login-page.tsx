"use client";

import { LogInFormEmail } from "@/app/[locale]/login/components/login-form-email/login-form-email";
import { LogInFormOtp } from "@/app/[locale]/login/components/login-form-otp/login-form-otp";
import { LOGIN_STYLES } from "@/app/[locale]/login/components/styles";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { LoginEmailProvider } from "@/contexts/loginEmailContext";
import { LoginOtpProvider } from "@/contexts/loginOtpContext";
import { useLogin } from "@/hooks/useLogin";
import { Collapse } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTranslations } from "next-intl";
import { OrDivider } from "../atoms/or-divider";
import { GoogleButton } from "../molecules/google-button";

const LoginPage = () => {
  const { isLoginUsingOtp, returnUrl } = useLogin();

  const t = useTranslations("login");
  const styles = LOGIN_STYLES;

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
        <Box marginBottom={5}>
          <Text text={t("login")} variant={TypographyVariant.h5} bold={true} />
        </Box>
        <Box sx={{ textAlign: "left", width: "100%" }}>
          <Text
            text={t("welcome")}
            variant={TypographyVariant.h5}
            bold={true}
          />
        </Box>
      </Box>
      <Collapse in={isLoginUsingOtp} timeout={styles.PAGE_TRANSITION_DURATION}>
        <LoginOtpProvider>
          <LogInFormOtp />
        </LoginOtpProvider>
      </Collapse>
      <Collapse in={!isLoginUsingOtp} timeout={styles.PAGE_TRANSITION_DURATION}>
        <LoginEmailProvider>
          <LogInFormEmail />
        </LoginEmailProvider>
      </Collapse>
      <OrDivider formMargin={styles.FORM_MARGIN} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <GoogleButton formMargin={styles.FORM_MARGIN} returnUrl={returnUrl} />
      </Box>
    </Container>
  );
};

export default LoginPage;
