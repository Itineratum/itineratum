"use client";

import { OrDivider } from "@/components/atoms/or-divider";
import Alert from "@/components/molecules/alert";
import { GoogleButton } from "@/components/molecules/google-button";
import { useSignup } from "@/hooks/useSignup";
import { Box, Collapse } from "@mui/material";
import { SIGNUP_STYLES } from "../styles";
import Step1 from "./step-1/step-1";
import Step2 from "./step-2/step-2";
import Step3 from "./step-3/step-3";

const SignUpForm = () => {
  const { stepNumber, showAlert, setShowAlert, alertType, alertText } =
    useSignup();

  const styles = SIGNUP_STYLES;

  return (
    <Box component="form" noValidate marginTop={styles.FORM_MARGIN}>
      <Collapse in={stepNumber === 1} timeout={styles.PAGE_TRANSITION_DURATION}>
        <Step1 />
      </Collapse>
      <Collapse in={stepNumber === 2} timeout={styles.PAGE_TRANSITION_DURATION}>
        <Step2 />
      </Collapse>
      <Collapse in={stepNumber === 3} timeout={styles.PAGE_TRANSITION_DURATION}>
        <Step3 />
      </Collapse>
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertType={alertType}
        alertText={alertText}
      />
      <OrDivider formMargin={styles.FORM_MARGIN} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <GoogleButton formMargin={styles.FORM_MARGIN} />
      </Box>
    </Box>
  );
};

export default SignUpForm;
