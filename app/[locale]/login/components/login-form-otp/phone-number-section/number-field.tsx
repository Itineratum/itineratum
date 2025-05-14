import { LogInFormOtpData } from "@/constants/types/formData/logInFormData";
import { useLoginOtp } from "@/hooks/useLoginOtp";
import { Box, TextField } from "@mui/material";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { number } from "zod";
import { LOGIN_STYLES } from "../../styles";
import GetOtpButton from "./getOtpButton";

const NumberField = () => {
  const { country, trigger, control, errors } = useLoginOtp();

  const t = useTranslations("login.loginForm");
  const styles = LOGIN_STYLES.LOGIN_FORM_OTP;

  const numberValidation = (numberInput: string) => {
    const isValid = isValidPhoneNumber(numberInput, country as CountryCode);
    return isValid ? true : t("numberError");
  };

  const handleNumberChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<LogInFormOtpData, "number">
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
          InputProps={{
            endAdornment: (
              <Box>
                <GetOtpButton />
              </Box>
            ),
          }}
        />
      )}
    />
  );
};

export default NumberField;
