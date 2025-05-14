"use client";

import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { useLogin } from "@/hooks/useLogin";
import { useLoginOtp } from "@/hooks/useLoginOtp";
import { Box } from "@mui/material";
import { LOGIN_STYLES } from "../styles";
import LoginButton from "./login-button";
import LoginUsingEmailButton from "./login-using-email-button";
import OtpField from "./otp-field";
import PhoneNumberSection from "./phone-number-section/phone-number-section";

export const LogInFormOtp = ({}: {}) => {
  const { handleSubmit, onSubmit } = useLoginOtp();
  const { showAlert, setShowAlert, alertText } = useLogin();

  const styles = LOGIN_STYLES;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      marginTop={styles.FORM_MARGIN}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PhoneNumberSection />
      <OtpField />
      <Box sx={{ display: "flex" }}>
        <PrivacyPolicyLink />
        <LoginUsingEmailButton />
      </Box>
      <LoginButton />
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertType={AlertType.error}
        alertText={alertText}
      />
    </Box>
  );
};
