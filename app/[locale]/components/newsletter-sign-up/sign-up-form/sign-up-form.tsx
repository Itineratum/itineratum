import Alert from "@/components/molecules/alert";
import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import { Box, Stack } from "@mui/material";
import { HOME_STYLES } from "../../styles";
import LeftImage from "./left-image";
import RightImage from "./right-image";
import UserInputs from "./user-inputs/user-inputs";

const SignUpForm = () => {
  const { ref, showAlert, setShowAlert, alertText, alertType } =
    useNewsletterSignup();

  const styles = HOME_STYLES.NEWSLETTER_SIGNUP;

  return (
    <Box
      ref={ref}
      sx={styles.SIGN_UP_FORM_SX}
      display="flex"
      justifyContent="center"
    >
      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          left: { xs: "150px", md: "40px" },
        }}
      >
        <LeftImage />
      </Box>
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Stack spacing={styles.GRID_SPACING - 1}>
          <UserInputs />
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertType={alertType}
            alertText={alertText}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: "-100px",
          top: { xs: "70%", md: "50%" },
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        <RightImage />
      </Box>
    </Box>
  );
};

export default SignUpForm;
