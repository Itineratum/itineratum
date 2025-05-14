import { countryInfoList } from "@/constants/enums/country";
import { SignUpFormData } from "@/constants/types/formData/signUpFormData";
import { useSignup } from "@/hooks/useSignup";
import { MenuItem, TextField } from "@mui/material";
import { CountryCode } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { SIGNUP_STYLES } from "../../styles";

const CountryField = () => {
  const { setValue, trigger, number, control, country, errors } = useSignup();

  const styles = SIGNUP_STYLES;
  const t = useTranslations("signUp.signUpForm");

  const handleCountryChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<SignUpFormData, "country">,
  ) => {
    field.onChange(event);
    const inputCountry = event.target.value;

    try {
      const callingCode =
        countryInfoList[inputCountry as CountryCode].callingCode;
      setValue("countryCode", callingCode);
      await trigger("country");

      if (number) await trigger("number");
    } catch (error) {
      setValue("countryCode", "");
    }
  };

  return (
    <Controller
      key={"country"}
      name={"country"}
      control={control}
      defaultValue=""
      rules={{ required: t("countryError") }}
      render={({ field }) => (
        <TextField
          {...field}
          select
          required
          fullWidth
          variant="filled"
          margin={styles.FORM_FIELD_MARGIN as any}
          label={t("country")}
          value={country}
          error={!!errors.country}
          helperText={errors.country ? (errors.country.message as string) : ""}
          onChange={async (event) => await handleCountryChange(event, field)}
          InputLabelProps={{ sx: { color: "text.primary" } }}
          SelectProps={{
            MenuProps: {
              MenuListProps: {
                sx: { maxHeight: styles.DROPDOWN_HEIGHT, overflowY: "auto" },
              },
            },
          }}
        >
          {Object.values(countryInfoList).map((country) => (
            <MenuItem key={country.name} value={country.iso2}>
              {`${country.name} ${country.flagEmoji}`}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default CountryField;
