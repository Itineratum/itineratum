import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useModifyEvent } from "@/hooks/useModifyEvent";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";
import LocationCityField from "./location-city-field";
import LocationNameField from "./location-name-field";
import ModifyEventButton from "./modify-event-button";
import TimeOfDayField from "./time-of-day-field";

const ModifyEventDialog = ({}: {}) => {
  const { modifyEventDialogOpen } = useReviewItinerary();
  const { handleOnClose, showAlert, setShowAlert, alertText, alertType } =
    useModifyEvent();

  const t = useTranslations("itinerary.modifyEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.MODIFY_EVENT_DIALOG;

  return (
    <Dialog
      open={modifyEventDialogOpen}
      onClose={handleOnClose}
      fullScreen={false}
      fullWidth={true}
    >
      {/* title */}
      <DialogTitle>
        <Text
          text={t("existingActivity")}
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
          <LocationNameField />
          <LocationCityField />
          <TimeOfDayField />
          <ModifyEventButton />
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

export default ModifyEventDialog;
