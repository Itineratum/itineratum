import { TypographyVariant } from "@/constants/enums/theme";
import { Stack, Box } from "@mui/material";
import { ITINERARY_STYLES } from "../../../styles";
import AmenitiesLocation from "./amenities-location/amenities-location";
import CheckInCheckOutTimesWebsite from "./check-in-check-out-times-website/check-in-check-out-times-website";
import ImageCarousel from "./image-carousel";
import RateClassType from "./rate-class-type/rate-class-type";
import RatingNumReviewsLocationRating from "./rating-num-reviews-location-rating/rating-num-reviews-location-rating";
import Text from "@/components/atoms/text";
import { useHotelSelector } from "@/hooks/useHotelSelector";

const HotelContent = () => {
  const { hotel } = useHotelSelector();

  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT;

  return (
    <Stack direction="column" spacing={styles.SPACING}>
      <Stack direction="column" spacing={styles.SPACING}>
        <ImageCarousel />
        <Box>
          {/* hotel name */}
          <Text
            text={hotel?.name ?? ""}
            variant={TypographyVariant.h6}
            bold={false}
          />
          {/* hotel description */}
          {hotel?.description && (
            <Text
              text={hotel.description}
              variant={TypographyVariant.body1}
              bold={false}
            />
          )}
        </Box>
      </Stack>
      <Stack direction="column" spacing={styles.SPACING}>
        <RateClassType />
        <RatingNumReviewsLocationRating />
        <CheckInCheckOutTimesWebsite />
        <AmenitiesLocation />
      </Stack>
    </Stack>
  );
};

export default HotelContent;
