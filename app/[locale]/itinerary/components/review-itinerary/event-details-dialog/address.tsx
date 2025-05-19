import Text from "@/components/atoms/text";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const Address = () => {
  const { selectedEvent } = useReviewItinerary();

  const event = selectedEvent;

  const t = useTranslations("itinerary.eventDetailsCard");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_DETAILS_DIALOG;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        maxWidth: styles.CONTENT_MAX_WIDTH,
        gap: styles.SPACING,
      }}
    >
      <Text
        text={t("address") + ": "}
        variant={styles.TYPOGRAPHY_VARIANT}
        bold={true}
        color={colorsConst.palette.text.primary}
      />
      <Text
        text={event ? event.location_address : ""}
        variant={styles.TYPOGRAPHY_VARIANT}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
    </Box>
  );
};

export default Address;
