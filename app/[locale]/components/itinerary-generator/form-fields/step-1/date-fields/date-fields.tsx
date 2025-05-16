import { HOME_STYLES } from "@/app/[locale]/components/styles";
import { Grid, Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import DateErrorMessage from "./date-error-message";
import FromDateField from "./from-date-field";
import ToDateField from "./to-date-field";

const DateFields = ({}: {}) => {
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_1;

  return (
    <Grid item xs={12} md={6} alignItems="flex-start" width="100%">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={styles.SPACING} direction="column" alignItems="center">
          <FromDateField />
          <ToDateField />
        </Stack>
      </LocalizationProvider>
      <DateErrorMessage />
    </Grid>
  );
};

export default DateFields;
