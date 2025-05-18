import Text from "@/components/atoms/text";
import { Currency } from "@/constants/enums/currency";
import { TypographyVariant } from "@/constants/enums/theme";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";
import AdjustBudgetButton from "./adjust-budget-button";

const BudgetSection = () => {
  const { canEdit, itineraryData } = useReviewItinerary();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY;

  return (
    canEdit &&
    itineraryData && (
      <Stack
        direction="row"
        spacing={styles.BUDGET_SECTION_SPACING}
        alignItems="center"
      >
        <Text
          text={`${t("budget")}: ${Currency[itineraryData.request.payload.localisation.currency]}${itineraryData.request.payload.budget}`}
          variant={TypographyVariant.h4}
          bold={true}
        />
        <AdjustBudgetButton />
      </Stack>
    )
  );
};

export default BudgetSection;
