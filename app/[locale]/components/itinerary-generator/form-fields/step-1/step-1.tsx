import { useStep1 } from "@/hooks/useStep1";
import { Box, Grid, Stack } from "@mui/material";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { HOME_STYLES } from "../../../styles";
import AddLocationButton from "./add-location-button";
import DateFields from "./date-fields/date-fields";
import DestinationItem from "./destination-item/destination-item";
import { DestinationField, OriginField } from "./location-fields";

const Step1 = ({}: {}) => {
  const { destinations } = useStep1();

  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_1;

  return (
    <Grid container spacing={styles.SPACING} alignItems="flex-start">
      <Grid item xs={12} md={6}>
        <Stack spacing={styles.SPACING} direction="column" alignItems="center">
          <OriginField />
          <DestinationField />
        </Stack>
        <AddLocationButton />
        <Box>
          {destinations.map((destination, index) => (
            <DestinationItem
              key={index}
              index={index}
              destination={destination}
            />
          ))}
        </Box>
      </Grid>
      <DateFields />
    </Grid>
  );
};

export default Step1;
