import { SignUpFormData } from "@/constants/types/formData/signUpFormData";
import { useSignup } from "@/hooks/useSignup";
import { TextField } from "@mui/material";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { SIGNUP_STYLES } from "../../../styles";

const NumberField = () => {
  const { trigger, number, errors, control, country } = useSignup();

  const t = useTranslations("signUp.signUpForm");
  const styles = SIGNUP_STYLES;

  const numberValidation = (numberInput: string) => {
    const isValid = isValidPhoneNumber(numberInput, country as CountryCode);
    return isValid ? true : t("numberError");
  };

  const handleNumberChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<SignUpFormData, "number">
  ) => {
    field.onChange(event.target.value);
    await trigger("number");
  };

  return (
    <Controller
      key={"number"}
      name={"number"}
      control={control}
      defaultValue=""
      rules={{
        validate: numberValidation,
        required: t("numberError"),
      }}
      render={({ field }) => (
        <TextField
          {...field}
          required
          fullWidth
          variant="filled"
          margin={styles.FORM_FIELD_MARGIN as any}
          label={t("number")}
          value={number}
          InputLabelProps={{
            sx: { color: "text.primary" },
          }}
          error={!!errors.number}
          helperText={errors.number ? (errors.number.message as string) : ""}
          onChange={async (event) => await handleNumberChange(event, field)}
        />
      )}
    />
  );
};

export default NumberField;
