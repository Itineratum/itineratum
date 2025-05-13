import colorsConst from "@/constants/pages/colors.json";
import { ChangePasswordFormData } from "@/constants/types/formData/accountPersonalInformationData";
import { useChangePassword } from "@/hooks/useChangePassword";
import { isValidPassword } from "@/utils/signUpFormValidation";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { ChangeEvent, useState } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { ACCOUNT_PERSONAL_INFORMATION_STYLES } from "../../styles";

const ReEnterNewPasswordField = () => {
  const { control, trigger, errors, newPassword, reEnterNewPassword } =
    useChangePassword();

  const t = useTranslations("account.personalInformation.changePassword");
  const styles = ACCOUNT_PERSONAL_INFORMATION_STYLES;

  const [showReEnterNewPassword, setShowReEnterNewPassword] =
    useState<boolean>(false);

  const handleClickShowReEnterNewPassword = () =>
    setShowReEnterNewPassword(!showReEnterNewPassword);

  const reEnterNewPasswordValidation = (reEnterNewPasswordInput: string) => {
    const isValid =
      reEnterNewPasswordInput === newPassword &&
      isValidPassword(reEnterNewPasswordInput);
    return isValid ? true : t("reEnterNewPasswordError");
  };

  const handleReEnterNewPasswordChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<ChangePasswordFormData, "reEnterNewPassword">,
  ) => {
    field.onChange(event.target.value);
    await trigger("reEnterNewPassword");
  };

  return (
    <Box>
      <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
        {t("reEnterNewPassword")}
      </InputLabel>
      <Controller
        key={"reEnterNewPassword"}
        name={"reEnterNewPassword"}
        control={control}
        defaultValue=""
        rules={{
          validate: reEnterNewPasswordValidation,
          required: t("reEnterNewPasswordError"),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            type={showReEnterNewPassword ? "text" : "password"}
            required
            fullWidth
            variant="filled"
            margin={styles.FORM_FIELD_MARGIN as any}
            value={reEnterNewPassword}
            sx={styles.TEXT_FIELD_SX}
            error={!!errors.reEnterNewPassword}
            helperText={
              errors.reEnterNewPassword
                ? (errors.reEnterNewPassword.message as string)
                : ""
            }
            onChange={async (event) =>
              await handleReEnterNewPasswordChange(event, field)
            }
            FormHelperTextProps={{ sx: { whiteSpace: "pre-line" } }} // ensures that newline characters (\n) are rendered as actual line breaks
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowReEnterNewPassword}
                    edge="end"
                  >
                    {showReEnterNewPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Box>
  );
};

export default ReEnterNewPasswordField;
