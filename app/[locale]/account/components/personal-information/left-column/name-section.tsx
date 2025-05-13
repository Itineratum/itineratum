import colorsConst from "@/constants/pages/colors.json";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Box, InputLabel, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { ACCOUNT_PERSONAL_INFORMATION_STYLES } from "../styles";

const NameSection = () => {
  const t = useTranslations("account.personalInformation");
  const { control } = usePersonalInformation();
  const styles = ACCOUNT_PERSONAL_INFORMATION_STYLES;
  const { firstName, lastName, errors } = usePersonalInformation();

  return (
    <Stack direction={"row"} spacing={styles.FIELD_SPACING}>
      {/* first name field */}
      <Box width="100%">
        <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
          {t("firstName")}
        </InputLabel>
        <Controller
          key={"firstName"}
          name={"firstName"}
          control={control}
          defaultValue=""
          rules={{
            required: t("firstNameError"),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="filled"
              margin={styles.FORM_FIELD_MARGIN as any}
              value={firstName}
              sx={styles.TEXT_FIELD_SX}
              error={!!errors.firstName}
              helperText={
                errors.firstName ? (errors.firstName.message as string) : ""
              }
            />
          )}
        />
      </Box>
      {/* last name field */}
      <Box width="100%">
        <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
          {t("lastName")}
        </InputLabel>
        <Controller
          key={"lastName"}
          name={"lastName"}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="filled"
              margin={styles.FORM_FIELD_MARGIN as any}
              value={lastName}
              sx={styles.TEXT_FIELD_SX}
            />
          )}
        />
      </Box>
    </Stack>
  );
};

export default NameSection;
