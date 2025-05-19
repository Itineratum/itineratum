import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import ItineraryGenerationSteps from "@/components/molecules/itinerary-generation-steps/itinerary-generation-steps";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAdjustBudgetDialog } from "@/hooks/useAdjustBudgetDialog";
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
import AdjustBudgetButton from "./adjust-budget-button";
import BudgetField from "./budget-field";

const AdjustBudgetDialog = ({}: {}) => {
  const { adjustBudgetDialogOpen, setAdjustBudgetDialogOpen } =
    useReviewItinerary();
  const {
    adjustingBudget,
    showAlert,
    setShowAlert,
    alertText,
    generationStep,
  } = useAdjustBudgetDialog();

  const t = useTranslations("itinerary.adjustBudgetDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.ADJUST_BUDGET_DIALOG;

  const handleOnClose = () => {
    if (!adjustingBudget) setAdjustBudgetDialogOpen(false);
  };

  return (
    <Dialog
      open={adjustBudgetDialogOpen}
      onClose={handleOnClose}
      fullScreen={false}
      maxWidth={false}
    >
      <DialogTitle>
        <Text
          text={t("adjustBudget")}
          variant={TypographyVariant.h4}
          bold={false}
        />
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
          <BudgetField />
          <AdjustBudgetButton />
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={alertText}
            alertType={AlertType.error}
          />
          <ItineraryGenerationSteps generationStep={generationStep} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AdjustBudgetDialog;
