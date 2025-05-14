"use client";

import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { useLogin } from "@/hooks/useLogin";
import { Box } from "@mui/material";
import { LOGIN_STYLES } from "../styles";
import EmailField from "./email-field";
import LoginButton from "./login-button";
import LoginUsingPhoneNumberButton from "./login-using-phone-number-button";
import PasswordField from "./password-field";
import { useLoginEmail } from "@/hooks/useLoginEmail";

export const LogInFormEmail = ({}: {}) => {
  const { showAlert, setShowAlert, alertText } = useLogin();
  const { handleSubmit, onSubmit } = useLoginEmail();

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
      <EmailField />
      <PasswordField />
      <Box sx={{ display: "flex" }}>
        <PrivacyPolicyLink />
        <LoginUsingPhoneNumberButton />
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
