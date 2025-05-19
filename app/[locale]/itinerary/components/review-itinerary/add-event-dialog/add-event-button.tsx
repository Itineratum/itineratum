import Text from "@/components/atoms/text";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { useAddEvent } from "@/hooks/useAddEvent";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import {
  generateSearchActivityJson,
  generateValidateNewJson,
  searchActivity,
  validateNew,
} from "@/lib/pythonBackend/pythonBackend";
import { EventTimeOfDay } from "@/lib/pythonBackend/types";
import { getEvents } from "@/lib/pythonBackend/utils";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";
import {
  AddEventToItineraryDetails,
  ItineraryEditAction,
} from "../review-itinerary";

const AddEventButton = () => {
  const {
    indexToAddEventTo,
    events,
    itineraryData,
    dayPlan,
    setCurrentEdit,
    setAddEventDialogOpen,
  } = useReviewItinerary();
  const {
    timeOfDay,
    trigger,
    isHotelEvent,
    setAddingActivity,
    setShowAlert,
    locationName,
    locationCity,
    setAlertText,
    setAlertType,
    checkInTime,
    checkOutTime,
    reset,
    addingActivity,
  } = useAddEvent();

  const itineraryRequest = itineraryData?.request;

  const t = useTranslations("itinerary.addEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.ADD_EVENT_DIALOG;

  const handleOnClick = async () => {
    try {
      if (!itineraryRequest || !dayPlan) return;

      const locationNameValid = await trigger("locationName");
      const locationCityValid = await trigger("locationCity");
      const timeOfDayValid = await trigger("timeOfDay");
      let checkInTimeValid;
      let checkOutTimeValid;

      if (isHotelEvent) {
        checkInTimeValid = await trigger("checkInTime");
        checkOutTimeValid = await trigger("checkOutTime");
      }

      if (locationNameValid && locationCityValid && timeOfDayValid) {
        if (isHotelEvent) {
          if (!checkInTimeValid || !checkOutTimeValid) return;
        }

        setAddingActivity(true);
        setShowAlert(false);
        const validateNewJson = generateValidateNewJson(
          itineraryRequest,
          events,
          dayPlan,
          timeOfDay,
          locationName,
          locationCity,
        );
        const validateNewRes = await validateNew(validateNewJson);

        if (!validateNewRes.success) {
          setAlertText(validateNewRes.reason);
          setAlertType(AlertType.error);
          setShowAlert(true);
          return;
        }

        const searchActivityJson = generateSearchActivityJson(
          locationName,
          locationCity,
        );
        const searchActivityRes = await searchActivity(searchActivityJson);
        const newEvents = await getEvents([searchActivityRes], timeOfDay);

        if (isHotelEvent) {
          newEvents[0].is_hotel = true;
          newEvents[0].checkInTime = checkInTime?.format("h:mm A")!;
          newEvents[0].checkOutTime = checkOutTime?.format("h:mm A")!;
        }

        const newEdit: Partial<
          Record<ItineraryEditAction, AddEventToItineraryDetails>
        > = {
          [ItineraryEditAction.add]: {
            indexToAddEventTo: indexToAddEventTo ?? 0,
            newEvent: newEvents[0],
          },
        };
        setCurrentEdit(newEdit);
        setAddEventDialogOpen(false);
        reset({
          isHotelEvent: false,
          locationName: "",
          locationCity: "",
          timeOfDay: null as unknown as EventTimeOfDay,
        });
      }
    } catch (error: any) {
      setAlertText(error.message);
      setAlertType(AlertType.error);
      setShowAlert(true);
    } finally {
      setAddingActivity(false);
    }
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        onClick={handleOnClick}
        sx={{ width: "auto", minWidth: "unset" }}
        disabled={addingActivity}
      >
        {addingActivity ? (
          <Stack
            direction="row"
            spacing={styles.SPACING}
            display="flex"
            alignItems="center"
          >
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
            <Text
              text={
                isHotelEvent ? t("addingHotelActivity") : t("addingActivity")
              }
              variant={TypographyVariant.button}
              bold={false}
            />
          </Stack>
        ) : (
          <Text
            text={isHotelEvent ? t("addHotelActivity") : t("addActivity")}
            variant={TypographyVariant.button}
            bold={false}
          />
        )}
      </Button>
    </Box>
  );
};

export default AddEventButton;
