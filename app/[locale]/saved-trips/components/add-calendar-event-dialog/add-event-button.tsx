import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useAddCalendarEvent } from "@/hooks/useAddCalendarEvent";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../styles";

const AddEventButton = () => {
  const {
    trigger,
    setIsAddingCalendarEvent,
    setShowAlert,
    isAddingCalendarEvent,
    addUserCalendarEvent,
    startDate,
    endDate,
    session,
    utils,
    name,
  } = useAddCalendarEvent();

  const t = useTranslations("savedTrips.addCalendarEventDialog");
  const styles = SAVED_TRIPS_STYLES.ADD_CALENDAR_EVENT_DIALOG;

  const handleOnClick = async () => {
    const nameValid = await trigger("name");
    const startDateValid = await trigger("startDate");
    const endDateValid = await trigger("endDate");

    if (!nameValid || !startDateValid || !endDateValid) return;

    setIsAddingCalendarEvent(true);
    const newCalendarEvent = {
      title: name,
      start: startDate.toDate(),
      end: endDate.toDate(),
      itineraryId: null,
    };
    const data = {
      email: session?.user.email!,
      calendarEvent: newCalendarEvent,
    };
    await addUserCalendarEvent.mutateAsync(data);
    setIsAddingCalendarEvent(false);
    setShowAlert(true);
    utils.user.invalidate();
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        onClick={handleOnClick}
        sx={{ width: "auto", minWidth: "unset" }}
        disabled={isAddingCalendarEvent}
      >
        {isAddingCalendarEvent ? (
          <Stack
            direction="row"
            spacing={styles.FIELD_SPACING}
            display="flex"
            alignItems="center"
          >
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
            <Text
              text={t("addingCalendarEvent")}
              variant={TypographyVariant.button}
              bold={false}
            />
          </Stack>
        ) : (
          <Text
            text={t("addCalendarEvent")}
            variant={TypographyVariant.button}
            bold={false}
          />
        )}
      </Button>
    </Box>
  );
};

export default AddEventButton;
