import Alert from "@/components/molecules/alert";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Grid, Stack } from "@mui/material";
import { ACCOUNT_PERSONAL_INFORMATION_STYLES } from "../styles";
import AddressSection from "./address-section";
import DateOfBirthField from "./date-of-birth-field";
import DeleteAccountButton from "./delete-account-button";
import SaveButton from "./save-button";

const RightColumn = () => {
  const { showAlert, setShowAlert, alertType, alertText } =
    usePersonalInformation();

  const styles = ACCOUNT_PERSONAL_INFORMATION_STYLES;

  return (
    <Grid item xs={12} md={6}>
      <Stack spacing={styles.FIELD_SPACING} useFlexGap>
        <AddressSection />
        <DateOfBirthField />
        {/* action buttons  */}
        <Stack
          direction={"row"}
          spacing={styles.FIELD_SPACING}
          useFlexGap
          my={styles.FORM_MARGIN}
        >
          <SaveButton />
          <DeleteAccountButton />
        </Stack>
        <Alert
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          alertType={alertType}
          alertText={alertText}
        />
      </Stack>
    </Grid>
  );
};

export default RightColumn;
