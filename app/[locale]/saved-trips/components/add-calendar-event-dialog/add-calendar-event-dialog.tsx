import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddCalendarEvent } from "@/hooks/useAddCalendarEvent";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../styles";
import AddEventButton from "./add-event-button";
import EndDateField from "./end-date-field";
import NameField from "./name-field";
import StartDateField from "./start-date-field";

const AddCalendarEventDialog = ({}: {}) => {
  const { showAddCalendarEventDialog } = useSavedTrips();
  const { showAlert, setShowAlert, handleOnClose } = useAddCalendarEvent();

  const t = useTranslations("savedTrips.addCalendarEventDialog");
  const styles = SAVED_TRIPS_STYLES.ADD_CALENDAR_EVENT_DIALOG;

  return (
    <Dialog
      open={showAddCalendarEventDialog}
      onClose={handleOnClose}
      fullScreen={false}
      fullWidth={true}
    >
      <DialogTitle>
        <Text text={t("title")} variant={TypographyVariant.h4} bold={false} />
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={styles.SPACING}>
          <DialogContentText>
            <Text
              text={t("description")}
              variant={TypographyVariant.h6}
              bold={false}
              color={colorsConst.palette.text.primary}
            />
          </DialogContentText>
          <NameField />
          <StartDateField />
          <EndDateField />
          <AddEventButton />
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={t("calendarEventAdded")}
            alertType={AlertType.success}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddCalendarEventDialog;
