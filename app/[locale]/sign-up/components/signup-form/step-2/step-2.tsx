import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import { Box } from "@mui/material";
import BackButton from "./back-button";
import EmailField from "./email-field";
import PasswordField from "./password-field";
import ReEnterPasswordField from "./reenter-password-field";
import SignupButton from "./signup-button";

const Step2 = () => {
  return (
    <Box>
      <EmailField />
      <PasswordField />
      <ReEnterPasswordField />
      <PrivacyPolicyLink />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BackButton />
        <SignupButton />
      </Box>
    </Box>
  );
};

export default Step2;
