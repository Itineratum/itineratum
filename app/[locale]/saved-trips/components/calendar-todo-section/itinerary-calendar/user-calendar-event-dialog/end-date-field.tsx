import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useUserCalendarEvent } from "@/hooks/useUserCalendarEvent";
import { Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { SAVED_TRIPS_STYLES } from "../../../styles";

const EndDateField = () => {
  const {
    control,
    errors,
    modifyMode,
    previousCalendarEvent,
    startDate,
    endDate,
  } = useUserCalendarEvent();

  const t = useTranslations("savedTrips.userCalendarEventDialog");
  const styles =
    SAVED_TRIPS_STYLES.CALENDAR_TODO_SECTION.ITINERARY_CALENDAR
      .USER_CALENDAR_EVENT_DIALOG;

  return (
    <Stack direction="row" spacing={styles.SPACING} alignItems="center">
      <Text
        text={t("endDate") + ":"}
        variant={TypographyVariant.h6}
        bold={true}
      />
      {modifyMode ? (
        // date input field
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name={"endDate"}
            control={control}
            rules={{
              required: t("endDateError"),
              validate: (value) =>
                !startDate || value.isAfter(startDate)
                  ? true
                  : t("endDateValidationError"),
            }}
            disabled={!startDate}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                value={endDate}
                minDateTime={startDate}
                closeOnSelect={false}
                slotProps={{
                  textField: {
                    error: !!errors.endDate,
                    helperText: errors.endDate
                      ? (errors.endDate.message as string)
                      : "",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      ) : (
        // value display
        <Text
          text={dayjs(previousCalendarEvent.end).format(
            "dddd, D MMMM YYYY, h:mm A",
          )}
          variant={TypographyVariant.h6}
          bold={false}
        />
      )}
    </Stack>
  );
};

export default EndDateField;
