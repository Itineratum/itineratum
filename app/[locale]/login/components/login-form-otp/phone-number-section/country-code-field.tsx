import { countryInfoList } from "@/constants/enums/country";
import { LogInFormOtpData } from "@/constants/types/formData/logInFormData";
import { useLoginOtp } from "@/hooks/useLoginOtp";
import { MenuItem, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { LOGIN_STYLES } from "../../styles";

const CountryCodeField = () => {
  const { getValues, setValue, trigger, number, control, errors } =
    useLoginOtp();

  const t = useTranslations("login.loginForm");
  const styles = LOGIN_STYLES.LOGIN_FORM_OTP;

  const countryCode = getValues("countryCode");
  const countryCodeFilled = Boolean(countryCode);

  const handleCountryCodeChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<LogInFormOtpData, "countryCode">
  ) => {
    field.onChange(event);
    const inputCountryCode = event.target.value;
    const countryIso2 = Object.values(countryInfoList).find(
      (country) => country.callingCode === inputCountryCode
    )?.iso2;
    setValue("country", countryIso2!);

    await trigger("countryCode");
    if (number) await trigger("number");
  };

  return (
    <Controller
      key={"countryCode"}
      name={"countryCode"}
      control={control}
      defaultValue=""
      rules={{ required: t("countryCodeError") }}
      render={({ field }) => (
        <TextField
          {...field}
          select
          required
          fullWidth
          variant="filled"
          margin={styles.FORM_FIELD_MARGIN as any}
          label={t("countryCode")}
          value={countryCode}
          error={!!errors.countryCode}
          helperText={
            errors.countryCode ? (errors.countryCode.message as string) : ""
          }
          onChange={async (event) =>
            await handleCountryCodeChange(event, field)
          }
          InputLabelProps={{
            sx: { color: "text.primary" },
            shrink: countryCodeFilled,
          }}
          SelectProps={{
            MenuProps: {
              MenuListProps: {
                sx: { maxHeight: styles.DROPDOWN_HEIGHT, overflowY: "auto" },
              },
            },
          }}
        >
          {Object.values(countryInfoList).map((country) => (
            <MenuItem key={country.name} value={country.callingCode}>
              {`${country.iso2} ${country.flagEmoji} (${country.callingCode})`}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default CountryCodeField;
