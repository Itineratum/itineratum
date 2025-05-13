import colorsConst from "@/constants/pages/colors.json";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Box, InputLabel, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { ACCOUNT_PERSONAL_INFORMATION_STYLES } from "../styles";

const AddressSection = () => {
  const t = useTranslations("account.personalInformation");
  const styles = ACCOUNT_PERSONAL_INFORMATION_STYLES;

  const { control, address1, address2 } = usePersonalInformation();

  return (
    <Stack spacing={styles.FIELD_SPACING}>
      {/* address 1 field  */}
      <Box>
        <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
          {t("address1")}
        </InputLabel>
        <Controller
          key={"address1"}
          name={"address1"}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="filled"
              margin={styles.FORM_FIELD_MARGIN as any}
              value={address1}
              sx={styles.TEXT_FIELD_SX}
            />
          )}
        />
      </Box>
      {/* address 2 field */}
      <Box>
        <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
          {t("address2")}
        </InputLabel>
        <Controller
          key={"address2"}
          name={"address2"}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="filled"
              margin={styles.FORM_FIELD_MARGIN as any}
              value={address2}
              sx={styles.TEXT_FIELD_SX}
            />
          )}
        />
      </Box>
    </Stack>
  );
};

export default AddressSection;
