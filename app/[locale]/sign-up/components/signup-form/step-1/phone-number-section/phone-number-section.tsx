import { Grid } from "@mui/material";
import { SIGNUP_STYLES } from "../../../styles";
import CountryCodeField from "./country-code-field";
import NumberField from "./number-field";

const PhoneNumberSection = () => {
  const styles = SIGNUP_STYLES.PHONE_NUMBER_SECTION;

  return (
    <Grid container spacing={2}>
      <Grid item xs={styles.COUNTRY_CODE_WIDTH}>
        <CountryCodeField />
      </Grid>
      <Grid item xs={styles.NUMBER_WIDTH}>
        <NumberField />
      </Grid>
    </Grid>
  );
};

export default PhoneNumberSection;
