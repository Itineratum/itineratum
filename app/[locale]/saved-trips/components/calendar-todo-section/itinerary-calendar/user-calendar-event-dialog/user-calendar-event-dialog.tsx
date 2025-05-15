import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { useUserCalendarEvent } from "@/hooks/useUserCalendarEvent";
import { Box, Dialog, DialogContent, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../../../styles";
import DeleteButton from "./delete-button";
import EndDateField from "./end-date-field";
import ModifyButton from "./modify-button";
import StartDateField from "./start-date-field";
import Title from "./title";

const UserCalendarEventDialog = ({}: {}) => {
  const { userCalendarEventDialogOpen } = useSavedTrips();
  const { handleOnClose, showAlert, setShowAlert } = useUserCalendarEvent();

  const t = useTranslations("savedTrips.userCalendarEventDialog");
  const styles =
    SAVED_TRIPS_STYLES.CALENDAR_TODO_SECTION.ITINERARY_CALENDAR
      .USER_CALENDAR_EVENT_DIALOG;

  return (
    <Dialog
      open={userCalendarEventDialogOpen}
      onClose={handleOnClose}
      fullScreen={false}
      fullWidth={true}
    >
      <Title />
      <DialogContent>
        <Stack direction="column" spacing={styles.SPACING}>
          <StartDateField />
          <EndDateField />
          <Box display="flex" justifyContent="flex-end">
            <Stack direction="row" spacing={styles.SPACING}>
              <ModifyButton />
              <DeleteButton />
            </Stack>
          </Box>
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={t("calendarEventModified")}
            alertType={AlertType.success}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UserCalendarEventDialog;
