"use client";

import Alert from "@/components/molecules/alert";
import { useChangePassword } from "@/hooks/useChangePassword";
import { Box, Stack } from "@mui/material";
import { ACCOUNT_PERFONAL_INFORMATION_STYLES } from "../../styles";
import CancelButton from "./cancel-button";
import CurrentPasswordField from "./current-password-field";
import NewPasswordField from "./new-password-field";
import ReEnterNewPasswordField from "./reenter-new-password-field";
import Title from "./title";
import UpdateButton from "./update-button";

const ChangePasswordForm = ({}: {}) => {
  const { showAlert, setShowAlert, alertText, alertType } = useChangePassword();

  const styles = ACCOUNT_PERFONAL_INFORMATION_STYLES;

  return (
    <Box component="form" noValidate>
      <Stack spacing={styles.FIELD_SPACING}>
        <Title />
        {/* fields  */}
        <Stack spacing={styles.FIELD_SPACING}>
          <CurrentPasswordField />
          <NewPasswordField />
          <ReEnterNewPasswordField />
        </Stack>
        {/* action buttons  */}
        <Box display="flex" justifyContent="flex-end">
          <Stack
            direction="row"
            spacing={styles.CHANGE_PASSWORD_FORM.BUTTON_SPACING}
          >
            <CancelButton />
            <UpdateButton />
          </Stack>
        </Box>
        <Alert
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          alertType={alertType}
          alertText={alertText}
        />
      </Stack>
    </Box>
  );
};

export default ChangePasswordForm;
