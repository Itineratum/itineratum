import { useSignup } from "@/hooks/useSignup";
import { TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { SIGNUP_STYLES } from "../../styles";

const VerificationCodeField = () => {
  const { control, verificationCode, errors } = useSignup();

  const t = useTranslations("signUp.signUpForm");
  const styles = SIGNUP_STYLES;

  return (
    <Controller
      key={"verificationCode"}
      name={"verificationCode"}
      control={control}
      defaultValue=""
      rules={{
        required: t(
          "emailVerification.emailVerificationForm.verificationCodeError"
        ),
      }}
      render={({ field }) => (
        <TextField
          {...field}
          required
          fullWidth
          variant="filled"
          margin={styles.FORM_FIELD_MARGIN as any}
          label={t("emailVerification.emailVerificationForm.verificationCode")}
          value={verificationCode}
          InputLabelProps={{
            sx: { color: "text.primary" },
          }}
          error={!!errors.verificationCode}
          helperText={
            errors.verificationCode
              ? (errors.verificationCode.message as string)
              : ""
          }
        />
      )}
    />
  );
};

export default VerificationCodeField;
