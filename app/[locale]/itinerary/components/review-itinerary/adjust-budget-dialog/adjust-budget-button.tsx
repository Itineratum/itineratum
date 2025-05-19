import { useAdjustBudgetDialog } from "@/hooks/useAdjustBudgetDialog";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { runPipelineWithGenerationSteps } from "@/lib/pythonBackend/pythonBackend";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ITINERARY_STYLES } from "../../styles";

const AdjustBudgetButton = () => {
  const { setAdjustBudgetDialogOpen } = useReviewItinerary();
  const {
    fields,
    setAdjustingBudget,
    itineraryRequest,
    itineraryId,
    adjustItineraryBudget,
    utils,
    setAlertText,
    setShowAlert,
    adjustingBudget,
    budget,
    setGenerationStep,
  } = useAdjustBudgetDialog();
  const router = useRouter();

  const t = useTranslations("itinerary.adjustBudgetDialog");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.ADJUST_BUDGET_DIALOG.ADJUST_BUDGET_BUTTON;

  const handleOnClick = async () => {
    const budgetIsValid = await fields.trigger("budget");

    if (!budgetIsValid || !itineraryRequest) return;

    setAdjustingBudget(true);
    try {
      // validate the itinerary request with the adjusted budget
      itineraryRequest.payload.budget = Number(fields.getValues("budget"));
      // const newItinerary = await debugRunPipelineWithGenerationSteps(
      //   itineraryRequest,
      //   setGenerationStep,
      // );
      const newItinerary = await runPipelineWithGenerationSteps(
        itineraryRequest,
        setGenerationStep,
      );
      const data = {
        itineraryId,
        request: itineraryRequest,
        itinerary: newItinerary.itinerary.itinerary ?? [],
        hotels: newItinerary.hotels ?? [],
        flights: newItinerary.flights ?? [],
      };
      await adjustItineraryBudget.mutateAsync(data);
      utils.itinerary.getItinerary.invalidate();
      setAdjustingBudget(false);
      setAdjustBudgetDialogOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setAlertText(error.message);
      setShowAlert(true);
    } finally {
      setAdjustingBudget(false);
    }
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        onClick={handleOnClick}
        sx={{ width: styles.WIDTH }}
        disabled={
          adjustingBudget ||
          (itineraryRequest && budget === itineraryRequest.payload.budget)
        }
      >
        {adjustingBudget ? (
          <Stack
            direction="row"
            spacing={styles.SPACING}
            display="flex"
            alignItems="center"
          >
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
            {t("adjusting")}
          </Stack>
        ) : (
          t("adjustBudget")
        )}
      </Button>
    </Box>
  );
};

export default AdjustBudgetButton;
