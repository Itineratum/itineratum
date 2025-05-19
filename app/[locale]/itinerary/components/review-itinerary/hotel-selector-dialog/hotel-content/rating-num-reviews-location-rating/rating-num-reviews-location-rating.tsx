import { Grid } from "@mui/material";
import { ITINERARY_STYLES } from "../../../../styles";
import LocationRating from "./location-rating";
import NumReviews from "./num-reviews";
import RatingField from "./rating-field";

const RatingNumReviewsLocationRating = () => {
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG;

  return (
    <Grid container sx={{ gap: { xs: styles.MOBILE_SPACING, md: 0 } }}>
      <RatingField />
      <NumReviews />
      <LocationRating />
    </Grid>
  );
};

export default RatingNumReviewsLocationRating;
