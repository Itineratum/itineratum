import { Grid } from "@mui/material";
import Amenities from "./amenities";
import Location from "./location";

const AmenitiesLocation = () => {
  return (
    <Grid container sx={{ gap: { xs: 4, md: 0 } }}>
      <Amenities />
      <Location />
    </Grid>
  );
};

export default AmenitiesLocation;
