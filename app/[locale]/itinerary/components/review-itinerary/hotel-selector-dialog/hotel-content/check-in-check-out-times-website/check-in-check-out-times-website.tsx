import { Grid } from "@mui/material";
import { ITINERARY_STYLES } from "../../../../styles";
import CheckInTime from "./check-in-time";
import CheckOutTime from "./check-out-time";
import Website from "./website";

const CheckInCheckOutTimesWebsite = () => {
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG;

  return (
    <Grid container sx={{ gap: { xs: styles.MOBILE_SPACING, md: 0 } }}>
      <CheckInTime />
      <CheckOutTime />
      <Website />
    </Grid>
  );
};

export default CheckInCheckOutTimesWebsite;
