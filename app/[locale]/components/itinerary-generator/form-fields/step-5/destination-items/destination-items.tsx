import { HOME_STYLES } from "@/app/[locale]/components/styles";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { Box } from "@mui/material";
import DestinationItem from "./destination-item/destination-item";

const DestinationItems = () => {
  const { fields } = useItineraryGenerator();

  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_5;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: styles.SPACING,
        flexDirection: "column",
      }}
    >
      {fields
        .getValues("userRequestedDestinations")
        .map((destination, index) => {
          return <DestinationItem destination={destination} index={index} />;
        })}
    </Box>
  );
};

export default DestinationItems;
