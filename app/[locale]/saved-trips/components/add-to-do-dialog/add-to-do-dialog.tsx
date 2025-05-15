import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddToDo } from "@/hooks/useAddToDo";
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
import AddToDoButton from "./add-to-do-button";
import ToDoField from "./to-do-field";

const AddToDoDialog = ({}: {}) => {
  const { showAddToDoDialog } = useSavedTrips();
  const { handleOnClose, showAlert, setShowAlert } = useAddToDo();

  const t = useTranslations("savedTrips.addToDoDialog");
  const styles = SAVED_TRIPS_STYLES.ADD_TO_DO_DIALOG;

  return (
    <Dialog
      open={showAddToDoDialog}
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
          <ToDoField />
          <AddToDoButton />
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={t("toDoAdded")}
            alertType={AlertType.success}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddToDoDialog;
