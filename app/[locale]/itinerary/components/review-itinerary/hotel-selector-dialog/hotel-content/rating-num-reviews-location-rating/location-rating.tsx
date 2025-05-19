import Text from "@/components/atoms/text";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { Grid, Rating, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../../styles";

const LocationRating = () => {
  const { hotel } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG;

  return (
    hotel?.location_rating && (
      <Grid
        item
        xs={12}
        md={4}
        display="flex"
        justifyContent={
          styles.HOTEL_CONTENT.RATING_NUM_REVIEWS_LOCATION_RATING
            .JUSTIFY_CONTENT
        }
      >
        <Stack
          direction="column"
          spacing={
            styles.HOTEL_CONTENT.RATING_NUM_REVIEWS_LOCATION_RATING.SPACING
          }
          display="flex"
          alignItems="center"
        >
          {/* label */}
          <Text
            text={t("locationRating")}
            variant={
              styles.HOTEL_CONTENT.RATING_NUM_REVIEWS_LOCATION_RATING
                .TYPOGRAPHY_VARIANT
            }
            bold={true}
          />
          {/* value */}
          <Stack direction="row" spacing={styles.RATING_SPACING}>
            <Rating
              precision={0.1}
              value={hotel?.location_rating ?? 0}
              readOnly
            />
            <Text
              text={
                hotel?.location_rating ? `${hotel.location_rating}/5` : t("na")
              }
              variant={
                styles.HOTEL_CONTENT.RATING_NUM_REVIEWS_LOCATION_RATING
                  .TYPOGRAPHY_VARIANT
              }
              bold={false}
            />
          </Stack>
        </Stack>
      </Grid>
    )
  );
};

export default LocationRating;
