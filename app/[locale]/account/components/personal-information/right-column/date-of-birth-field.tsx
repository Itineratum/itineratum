import colorsConst from "@/constants/pages/colors.json";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Box, InputLabel } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { ACCOUNT_PERFONAL_INFORMATION_STYLES } from "../styles";

const DateOfBirthField = () => {
  const { control, dateOfBirth } = usePersonalInformation();

  const t = useTranslations("account.personalInformation");
  const styles = ACCOUNT_PERFONAL_INFORMATION_STYLES;

  return (
    <Box>
      <InputLabel
        sx={{
          color: colorsConst.palette.text.primary,
          marginBottom: styles.FORM_MARGIN,
        }}
      >
        {t("dob")}
      </InputLabel>
      <Controller
        key={"dateOfBirth"}
        name={"dateOfBirth"}
        control={control}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              {...field}
              format={styles.DATE_OF_BIRTH_FORMAT}
              sx={{ width: "100%" }}
              value={dateOfBirth}
              onChange={(date: Dayjs | null) => {
                const utcDate = date
                  ? dayjs(date).utc(true).startOf("day")
                  : null;
                field.onChange(utcDate);
              }}
            />
          </LocalizationProvider>
        )}
      />
    </Box>
  );
};

export default DateOfBirthField;
