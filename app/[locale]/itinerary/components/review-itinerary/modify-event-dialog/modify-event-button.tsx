import Text from "@/components/atoms/text";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { useModifyEvent } from "@/hooks/useModifyEvent";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import {
  generateSearchActivityJson,
  generateValidateEditJson,
  searchActivity,
  validateEdit,
} from "@/lib/pythonBackend/pythonBackend";
import { getEvents } from "@/lib/pythonBackend/utils";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";
import {
  ItineraryEditAction,
  ModifyEventInItineraryDetails,
} from "../review-itinerary";

const ModifyEventButton = () => {
  const {
    events,
    indexToModifyEventAt,
    itineraryData,
    dayPlan,
    setCurrentEdit,
    setModifyEventDialogOpen,
  } = useReviewItinerary();
  const {
    trigger,
    hasModifications,
    setModifyingActivity,
    setShowAlert,
    setAlertText,
    setAlertType,
    locationName,
    locationCity,
    timeOfDay,
    dayNum,
    modifyingActivity,
  } = useModifyEvent();

  const itineraryRequest = itineraryData?.request;
  const event = events[indexToModifyEventAt ?? 0];

  const t = useTranslations("itinerary.modifyEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.MODIFY_EVENT_DIALOG;

  const handleOnClick = async () => {
    try {
      if (!itineraryRequest || !dayPlan) return;

      const locationNameValid = await trigger("locationName");
      const locationCityValid = await trigger("locationCity");
      const timeOfDayValid = await trigger("timeOfDay");
      const dayNumValid = await trigger("dayNum");

      if (
        locationNameValid &&
        locationCityValid &&
        timeOfDayValid &&
        dayNumValid &&
        hasModifications
      ) {
        // TODO: to confirm with Oscar how to handle the validation of events/activities being shifted across days in the itinerary

        setModifyingActivity(true);
        setShowAlert(false);
        const updatedEvents = [...events];
        updatedEvents[indexToModifyEventAt ?? 0] = {
          ...updatedEvents[indexToModifyEventAt ?? 0],
          event_name: `${locationName}, ${locationCity}`,
          time_of_day: timeOfDay,
        };
        const validateEditJson = generateValidateEditJson(
          itineraryRequest,
          updatedEvents,
          dayPlan
        );

        // TODO: temporarily disable for development purposes
        // const validateEditRes = await validateEdit(validateEditJson);

        // if (!validateEditRes.success) {
        //   setAlertText(validateEditRes.reason);
        //   setAlertType(AlertType.error);
        //   setShowAlert(true);
        //   return;
        // }

        const searchActivityJson = generateSearchActivityJson(
          locationName,
          locationCity
        );
        const searchActivityRes = await searchActivity(searchActivityJson);
        const modifiedEvents = await getEvents([searchActivityRes], timeOfDay);
        const newEdit: Partial<
          Record<ItineraryEditAction, ModifyEventInItineraryDetails>
        > = {
          [ItineraryEditAction.modify]: {
            indexToModifyEventAt: indexToModifyEventAt ?? 0,
            modifiedEvent: modifiedEvents[0],
            timeOfDayChange: timeOfDay !== event.time_of_day,
            dayNumChange: dayNum !== dayPlan.day,
            dayNum,
          },
        };
        setCurrentEdit(newEdit);
        setModifyEventDialogOpen(false);
      }
    } catch (error: any) {
      setAlertText(error.message);
      setAlertType(AlertType.error);
      setShowAlert(true);
    } finally {
      setModifyingActivity(false);
    }
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        onClick={handleOnClick}
        sx={{ width: "auto", minWidth: "unset" }}
        disabled={modifyingActivity || !hasModifications}
      >
        {modifyingActivity ? (
          <Stack
            direction="row"
            spacing={styles.FIELD_SPACING}
            display="flex"
            alignItems="center"
          >
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
            <Text
              text={t("modifyingActivity")}
              variant={TypographyVariant.button}
              bold={false}
            />
          </Stack>
        ) : (
          <Text
            text={t("modifyActivity")}
            variant={TypographyVariant.button}
            bold={false}
          />
        )}
      </Button>
    </Box>
  );
};

export default ModifyEventButton;
