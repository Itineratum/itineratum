import { Stack } from "@mui/material";
import { HOME_STYLES } from "../../../styles";
import DestinationItems from "./destination-items/destination-items";
import LabelSection from "./label-section";

const DaysAllocationSection = () => {
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_5;

  return (
    <Stack
      spacing={styles.SPACING}
      direction="column"
      width="100%"
      sx={{ display: "flex", alignItems: "center" }}
    >
      <LabelSection />
      <DestinationItems />
    </Stack>
  );
};

export default DaysAllocationSection;
