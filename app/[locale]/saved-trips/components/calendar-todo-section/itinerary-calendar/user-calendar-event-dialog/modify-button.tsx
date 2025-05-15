import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { CalendarEvent } from "@/constants/types/calendarEvent";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { useUserCalendarEvent } from "@/hooks/useUserCalendarEvent";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../../../styles";

const ModifyButton = () => {
  const {
    modifyMode,
    startDate,
    endDate,
    setShowAlert,
    hasModifications,
    trigger,
    setIsModifying,
    setModifyMode,
    setHasModifications,
    isDeleting,
    isModifying,
    modifyUserCalendarEvent,
    setPreviousCalendarEvent,
    utils,
    name,
  } = useUserCalendarEvent();
  const { selectedUserCalendarEvent } = useSavedTrips();
  const { data: session } = useSession();

  const t = useTranslations("savedTrips.userCalendarEventDialog");
  const styles =
    SAVED_TRIPS_STYLES.CALENDAR_TODO_SECTION.ITINERARY_CALENDAR
      .USER_CALENDAR_EVENT_DIALOG;

  const handleOnClick = async () => {
    setShowAlert(false);

    // if it is in modify mode, validate the fields and then update the MongoDB if necessary
    if (modifyMode) {
      if (!hasModifications) {
        setModifyMode(false);
        return;
      }

      const nameValid = await trigger("name");
      const startDateValid = await trigger("startDate");
      const endDateValid = await trigger("endDate");

      if (!nameValid || !startDateValid || !endDateValid) return;

      setIsModifying(true);
      const modifiedCalendarEvent: CalendarEvent = {
        title: name,
        start: startDate.toDate(),
        end: endDate.toDate(),
        itineraryId: null,
        _id: selectedUserCalendarEvent!._id,
      };
      setPreviousCalendarEvent(modifiedCalendarEvent);
      const data = {
        email: session?.user.email!,
        modifiedCalendarEvent,
      };
      await modifyUserCalendarEvent.mutateAsync(data);
      setIsModifying(false);
      setModifyMode(false);
      setHasModifications(false);
      setShowAlert(true);
      utils.user.invalidate();
    } else {
      setModifyMode(true);
    }
  };

  return (
    !isDeleting && (
      <Button
        variant="contained"
        onClick={handleOnClick}
        sx={{ width: "auto", minWidth: "unset" }}
        disabled={isModifying}
      >
        {isModifying ? (
          <Stack
            direction="row"
            spacing={styles.SPACING}
            display="flex"
            alignItems="center"
          >
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
            <Text
              text={t("modifying")}
              variant={TypographyVariant.button}
              bold={false}
            />
          </Stack>
        ) : (
          <Text
            text={
              modifyMode
                ? hasModifications
                  ? t("save")
                  : t("stop")
                : t("modify")
            }
            variant={TypographyVariant.button}
            bold={false}
          />
        )}
      </Button>
    )
  );
};

export default ModifyButton;
