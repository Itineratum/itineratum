import Text from "@/components/atoms/text";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Box, Rating, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../styles";

const RatingField = () => {
  const { selectedEvent } = useReviewItinerary();
  const event = selectedEvent;

  const t = useTranslations("itinerary.eventDetailsCard");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_DETAILS_DIALOG;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: styles.SPACING,
      }}
    >
      <Text
        text={t("rating") + ": "}
        variant={styles.TYPOGRAPHY_VARIANT}
        bold={true}
        color={colorsConst.palette.text.primary}
      />
      {event ? (
        <Stack direction="row" spacing={styles.SPACING}>
          <Rating
            precision={0.1}
            value={event.rating ? event.rating : 0}
            readOnly
          />
          <Text
            text={event.rating ? `${event.rating}/5` : "No Rating"}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={false}
            color={colorsConst.palette.text.primary}
          />
        </Stack>
      ) : null}
    </Box>
  );
};

export default RatingField;
