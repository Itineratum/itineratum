import { ChangePasswordFormData } from "@/constants/types/formData/accountPersonalInformationData";
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
import colorsConst from "@/constants/pages/colors.json";
import { useChangePassword } from "@/hooks/useChangePassword";
import { ACCOUNT_PERFONAL_INFORMATION_STYLES } from "../../styles";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const CurrentPasswordField = () => {
  const { control, trigger, currentPassword, errors } = useChangePassword();

  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);

  const t = useTranslations("account.personalInformation.changePassword");
  const styles = ACCOUNT_PERFONAL_INFORMATION_STYLES;

  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword(!showCurrentPassword);

  const handleCurrentPasswordChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<ChangePasswordFormData, "currentPassword">
  ) => {
    field.onChange(event.target.value);
    await trigger("currentPassword");
  };

  return (
    <Box>
      <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
        {t("currentPassword")}
      </InputLabel>
      <Controller
        key={"currentPassword"}
        name={"currentPassword"}
        control={control}
        defaultValue=""
        rules={{ required: t("currentPasswordError") }}
        render={({ field }) => (
          <TextField
            {...field}
            type={showCurrentPassword ? "text" : "password"}
            required
            fullWidth
            variant="filled"
            margin={styles.FORM_FIELD_MARGIN as any}
            value={currentPassword}
            sx={styles.TEXT_FIELD_SX}
            error={!!errors.currentPassword}
            helperText={
              errors.currentPassword
                ? (errors.currentPassword.message as string)
                : ""
            }
            onChange={async (event) =>
              await handleCurrentPasswordChange(event, field)
            }
            FormHelperTextProps={{ sx: { whiteSpace: "pre-line" } }} // ensures that newline characters (\n) are rendered as actual line breaks
            InputLabelProps={{
              sx: { color: "text.primary" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowCurrentPassword}
                    edge="end"
                  >
                    {showCurrentPassword ? (
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

export default CurrentPasswordField;
