import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";
import EventCardsWithTravelTime from "./event-cards-with-travel-time";

const ItineraryGeneratedSection = () => {
  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY;

  return (
    <Stack
      direction="column"
      spacing={styles.ITINERARY_GENERATED_SECTION_SPACING}
    >
      <Text
        text={t("itineraryGenerated")}
        variant={TypographyVariant.h5}
        bold={true}
        textDecoration={TypographyTextDecoration.underline}
      />
      <EventCardsWithTravelTime />
    </Stack>
  );
};

export default ItineraryGeneratedSection;
