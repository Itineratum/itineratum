import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddCalendarEvent } from "@/hooks/useAddCalendarEvent";
import { Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { SAVED_TRIPS_STYLES } from "../styles";

const StartDateField = () => {
  const { control, errors, startDate } = useAddCalendarEvent();

  const t = useTranslations("savedTrips.addCalendarEventDialog");
  const styles = SAVED_TRIPS_STYLES.ADD_CALENDAR_EVENT_DIALOG;

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      spacing={styles.FIELD_SPACING}
    >
      <Text
        text={t("startDate") + ":"}
        variant={TypographyVariant.h6}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={"startDate"}
          control={control}
          rules={{
            required: t("startDateError"),
          }}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              value={startDate}
              slotProps={{
                textField: {
                  error: !!errors.startDate,
                  helperText: errors.startDate
                    ? (errors.startDate.message as string)
                    : "",
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </Stack>
  );
};

export default StartDateField;
