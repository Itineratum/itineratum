import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Grid } from "@mui/material";
import { ITINERARY_STYLES } from "../../../styles";
import OpeningHours from "./opening-hours";
import RatingField from "./rating-field";

const OpeningHoursRatingSection = () => {
  const { selectedEvent } = useReviewItinerary();
  const event = selectedEvent;

  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_DETAILS_DIALOG;

  if (
    event &&
    event.openingHours &&
    event.openingHours.length > 0 &&
    event.rating &&
    event.rating > 0
  ) {
    return (
      <Grid container sx={{ gap: { xs: styles.SPACING, md: 0 } }}>
        <Grid item xs={12} md={8}>
          <OpeningHours />
        </Grid>
        <Grid item xs={12} md={4}>
          <RatingField />
        </Grid>
      </Grid>
    );
  } else if (event && event.openingHours && event.openingHours.length > 0) {
    return <OpeningHours />;
  } else if (event && event.rating && event.rating > 0) {
    return <RatingField />;
  } else {
    return null;
  }
};

export default OpeningHoursRatingSection;
