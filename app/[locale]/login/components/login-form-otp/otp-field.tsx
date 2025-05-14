import { useLoginOtp } from "@/hooks/useLoginOtp";
import { TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { LOGIN_STYLES } from "../styles";

const OtpField = () => {
  const { control, otp, errors } = useLoginOtp();

  const t = useTranslations("login.loginForm");
  const styles = LOGIN_STYLES.LOGIN_FORM_OTP;

  return (
    <Controller
      key={"otp"}
      name={"otp"}
      control={control}
      defaultValue=""
      rules={{
        required: t("otpError"),
      }}
      render={({ field }) => (
        <TextField
          {...field}
          required
          fullWidth
          variant="filled"
          margin={styles.FORM_FIELD_MARGIN as any}
          label={t("otp")}
          value={otp}
          InputLabelProps={{
            sx: { color: "text.primary" },
          }}
          error={!!errors.otp}
          helperText={errors.otp ? (errors.otp.message as string) : ""}
        />
      )}
    />
  );
};

export default OtpField;
