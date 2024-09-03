"use client";

import EmailVerificationForm from "@/app/[locale]/email-verification/components/email-verification-form";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTranslations } from "next-intl";

const EmailVerificationPage = () => {
  const t = useTranslations();

  const verifyEmailText = () => {
    return (
      <Box marginBottom={5}>
        <Text
          text={t("emailVerification.emailVerification")}
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
        {verifyEmailText()}
      </Box>
      <EmailVerificationForm />
    </Container>
  );
};

export default EmailVerificationPage;
