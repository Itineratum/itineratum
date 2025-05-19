import Text from "@/components/atoms/text";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const Website = () => {
  const { selectedEvent } = useReviewItinerary();

  const event = selectedEvent;

  const t = useTranslations("itinerary.eventDetailsCard");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_DETAILS_DIALOG;

  return event && event.website_uri && event.website_uri !== "N/A" ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        maxWidth: styles.CONTENT_MAX_WIDTH,
        gap: styles.SPACING,
      }}
    >
      <Text
        text={t("website") + ": "}
        variant={styles.TYPOGRAPHY_VARIANT}
        bold={true}
        color={colorsConst.palette.text.primary}
      />
      <Text
        text={t("clickHere")}
        variant={styles.TYPOGRAPHY_VARIANT}
        bold={false}
        color={colorsConst.palette.text.primary}
        link={event ? event.website_uri : ""}
      />
    </Box>
  ) : null;
};

export default Website;
