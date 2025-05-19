import { Grid } from "@mui/material";
import { ITINERARY_STYLES } from "../../../../styles";
import HotelClass from "./hotel-class";
import RatePerNight from "./rate-per-night";
import Type from "./type";

const RateClassType = () => {
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG;

  return (
    <Grid container sx={{ gap: { xs: styles.MOBILE_SPACING, md: 0 } }}>
      <RatePerNight />
      <HotelClass />
      <Type />
    </Grid>
  );
};

export default RateClassType;
