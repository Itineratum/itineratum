import colorsConst from "@/constants/pages/colors.json";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Box, InputLabel, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { ACCOUNT_PERSONAL_INFORMATION_STYLES } from "../styles";

const EmailField = () => {
  const t = useTranslations("account.personalInformation");
  const styles = ACCOUNT_PERSONAL_INFORMATION_STYLES;
  const { control, email } = usePersonalInformation();

  return (
    <Box>
      <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
        {t("email")}
      </InputLabel>
      <Controller
        key={"email"}
        name={"email"}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            variant="filled"
            margin={styles.FORM_FIELD_MARGIN as any}
            value={email}
            sx={styles.TEXT_FIELD_SX}
            disabled
          />
        )}
      />
    </Box>
  );
};

export default EmailField;
