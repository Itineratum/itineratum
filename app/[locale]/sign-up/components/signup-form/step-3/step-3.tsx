import { Box } from "@mui/material";
import VerificationCodeField from "./verification-code-field";
import VerifyButton from "./verify-button";

const Step3 = () => {
  return (
    <Box>
      <VerificationCodeField />
      <Box display="flex" justifyContent="flex-end">
        <VerifyButton />
      </Box>
    </Box>
  );
};

export default Step3;
