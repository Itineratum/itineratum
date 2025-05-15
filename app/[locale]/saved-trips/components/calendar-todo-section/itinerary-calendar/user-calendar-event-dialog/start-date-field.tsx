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

const StartDateField = () => {
  const { control, errors, modifyMode, previousCalendarEvent, startDate } =
    useUserCalendarEvent();

  const t = useTranslations("savedTrips.userCalendarEventDialog");
  const styles =
    SAVED_TRIPS_STYLES.CALENDAR_TODO_SECTION.ITINERARY_CALENDAR
      .USER_CALENDAR_EVENT_DIALOG;

  return (
    <Stack direction="row" spacing={styles.SPACING} alignItems="center">
      <Text
        text={t("startDate") + ":"}
        variant={TypographyVariant.h6}
        bold={true}
      />
      {modifyMode ? (
        // date input field
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
      ) : (
        // value display
        <Text
          text={dayjs(previousCalendarEvent.start).format(
            "dddd, D MMMM YYYY, h:mm A"
          )}
          variant={TypographyVariant.h6}
          bold={false}
        />
      )}
    </Stack>
  );
};

export default StartDateField;
