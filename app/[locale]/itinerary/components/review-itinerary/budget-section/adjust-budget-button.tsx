import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

const AdjustBudgetButton = () => {
  const { setAdjustBudgetDialogOpen, isEditing, edits } = useReviewItinerary();
  const t = useTranslations("itinerary");

  const handleOnClick = () => {
    setAdjustBudgetDialogOpen(true);
  };

  return (
    <Button
      variant="contained"
      onClick={handleOnClick}
      disabled={isEditing || edits.length > 0}
    >
      <Text
        text={t("adjustBudgetDialog.adjustBudget")}
        variant={TypographyVariant.button}
        bold={true}
      />
    </Button>
  );
};

export default AdjustBudgetButton;
