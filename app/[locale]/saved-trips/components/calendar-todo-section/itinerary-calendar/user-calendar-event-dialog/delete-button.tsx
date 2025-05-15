import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { useUserCalendarEvent } from "@/hooks/useUserCalendarEvent";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../../../styles";

const DeleteButton = () => {
  const {
    modifyMode,
    isDeleting,
    isModifying,
    utils,
    setIsDeleting,
    deleteUserCalendarEvent,
  } = useUserCalendarEvent();
  const { selectedUserCalendarEvent, setUserCalendarEventDialogOpen } =
    useSavedTrips();
  const { data: session } = useSession();

  const t = useTranslations("savedTrips.userCalendarEventDialog");
  const styles =
    SAVED_TRIPS_STYLES.CALENDAR_TODO_SECTION.ITINERARY_CALENDAR
      .USER_CALENDAR_EVENT_DIALOG;

  const handleOnClick = async () => {
    setIsDeleting(true);
    const data = {
      email: session?.user.email!,
      calendarEventId: selectedUserCalendarEvent!._id,
    };
    await deleteUserCalendarEvent.mutateAsync(data);
    utils.user.invalidate();
    setIsDeleting(false);
    setUserCalendarEventDialogOpen(false);
  };

  return (
    !modifyMode &&
    !isModifying && (
      <Button
        variant="contained"
        onClick={handleOnClick}
        sx={{
          width: "auto",
          minWidth: "unset",
          backgroundColor: colorsConst.components.button.deleteColor,
        }}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Stack
            direction="row"
            spacing={styles.SPACING}
            display="flex"
            alignItems="center"
          >
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
            <Text
              text={t("deleting")}
              variant={TypographyVariant.button}
              bold={false}
            />
          </Stack>
        ) : (
          <Text
            text={t("delete")}
            variant={TypographyVariant.button}
            bold={false}
          />
        )}
      </Button>
    )
  );
};

export default DeleteButton;
