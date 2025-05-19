import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddEvent } from "@/hooks/useAddEvent";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { EventTimeOfDay } from "@/lib/pythonBackend/types";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";
import AddEventButton from "./add-event-button";
import CheckInTimeField from "./check-in-time-field";
import CheckOutTimeField from "./check-out-time-field";
import HotelEventSwitch from "./hotel-event-switch";
import LocationCityField from "./location-city-field";
import LocationNameField from "./location-name-field";
import TimeOfDayField from "./time-of-day-field";

const AddEventDialog = ({}: {}) => {
  const { addEventDialogOpen, setAddEventDialogOpen } = useReviewItinerary();
  const {
    setShowAlert,
    reset,
    addingActivity,
    showAlert,
    alertText,
    alertType,
  } = useAddEvent();

  const t = useTranslations("itinerary.addEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.ADD_EVENT_DIALOG;

  const handleOnClose = () => {
    if (!addingActivity) {
      setShowAlert(false);
      setAddEventDialogOpen(false);
      reset({
        isHotelEvent: false,
        locationName: "",
        locationCity: "",
        timeOfDay: null as unknown as EventTimeOfDay,
      });
    }
  };

  return (
    <Dialog
      open={addEventDialogOpen}
      onClose={handleOnClose}
      fullScreen={false}
      fullWidth={true}
    >
      {/* title */}
      <DialogTitle>
        <Text
          text={t("newActivity")}
          variant={TypographyVariant.h4}
          bold={false}
        />
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={styles.SPACING}>
          {/* description */}
          <DialogContentText>
            <Text
              text={t("description")}
              variant={TypographyVariant.h6}
              bold={false}
              color={colorsConst.palette.text.primary}
            />
          </DialogContentText>
          <HotelEventSwitch />
          <LocationNameField />
          <LocationCityField />
          <CheckInTimeField />
          <CheckOutTimeField />
          <TimeOfDayField />
          <AddEventButton />
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={alertText}
            alertType={alertType}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
