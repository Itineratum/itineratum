import { Grid } from "@mui/material";
import { LOGIN_STYLES } from "../../styles";
import CountryCodeField from "./country-code-field";
import NumberField from "./number-field";

const PhoneNumberSection = () => {
  const styles = LOGIN_STYLES.LOGIN_FORM_OTP;

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
