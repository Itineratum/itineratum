import { ChangePasswordFormData } from "@/constants/types/formData/accountPersonalInformationData";
import { isValidPassword } from "@/utils/signUpFormValidation";
import {
  Box,
  InputLabel,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState, ChangeEvent } from "react";
import { ControllerRenderProps, Controller } from "react-hook-form";
import { ACCOUNT_PERFONAL_INFORMATION_STYLES } from "../../styles";
import { useChangePassword } from "@/hooks/useChangePassword";
import colorsConst from "@/constants/pages/colors.json";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const NewPasswordField = () => {
  const { control, trigger, errors, reEnterNewPassword, newPassword } =
    useChangePassword();

  const t = useTranslations("account.personalInformation.changePassword");
  const styles = ACCOUNT_PERFONAL_INFORMATION_STYLES;

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);

  const newPasswordValidation = (newPasswordInput: string) => {
    const isValid = isValidPassword(newPasswordInput);
    return isValid ? true : t("newPasswordError");
  };

  const handleNewPasswordChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<ChangePasswordFormData, "newPassword">
  ) => {
    field.onChange(event.target.value);
    await trigger("newPassword");

    if (reEnterNewPassword) await trigger("reEnterNewPassword");
  };

  return (
    <Box>
      <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
        {t("newPassword")}
      </InputLabel>
      <Controller
        key={"newPassword"}
        name={"newPassword"}
        control={control}
        defaultValue=""
        rules={{
          validate: newPasswordValidation,
          required: t("newPasswordError"),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            type={showNewPassword ? "text" : "password"}
            required
            fullWidth
            variant="filled"
            margin={styles.FORM_FIELD_MARGIN as any}
            value={newPassword}
            sx={styles.TEXT_FIELD_SX}
            error={!!errors.newPassword}
            helperText={
              errors.newPassword ? (errors.newPassword.message as string) : ""
            }
            onChange={async (event) =>
              await handleNewPasswordChange(event, field)
            }
            FormHelperTextProps={{ sx: { whiteSpace: "pre-line" } }} // ensures that newline characters (\n) are rendered as actual line breaks
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowNewPassword} edge="end">
                    {showNewPassword ? (
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

export default NewPasswordField;
