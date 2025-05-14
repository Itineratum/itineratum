import { useSignup } from "@/hooks/useSignup";
import { TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { SIGNUP_STYLES } from "../../../styles";

const CountryCodeField = () => {
  const { getValues, control } = useSignup();

  const styles = SIGNUP_STYLES;
  const t = useTranslations("signUp.signUpForm");

  const countryCode = getValues("countryCode");
  const countryCodeFilled = Boolean(countryCode);

  return (
    <Controller
      key={"countryCode"}
      name={"countryCode"}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          required
          fullWidth
          variant="filled"
          margin={styles.FORM_FIELD_MARGIN as any}
          label={t("countryCode")}
          value={countryCode}
          InputProps={{ readOnly: true }}
          InputLabelProps={{
            sx: { color: "text.primary" },
            shrink: countryCodeFilled,
          }}
        />
      )}
    />
  );
};

export default CountryCodeField;
