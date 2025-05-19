import Text from "@/components/atoms/text";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../../styles";

const NumReviews = () => {
  const { hotel } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT
      .RATING_NUM_REVIEWS_LOCATION_RATING;

  return (
    hotel?.num_reviews && (
      <Grid
        item
        xs={12}
        md={4}
        display="flex"
        justifyContent={styles.JUSTIFY_CONTENT}
      >
        <Stack
          direction="column"
          spacing={styles.SPACING}
          display="flex"
          alignItems="center"
        >
          {/* label */}
          <Text
            text={t("numReviews")}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={true}
          />
          {/* value */}
          <Text
            text={`${hotel?.num_reviews}`}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={false}
          />
        </Stack>
      </Grid>
    )
  );
};

export default NumReviews;
