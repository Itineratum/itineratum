import { Stack } from "@mui/material";
import { HOME_STYLES } from "../../../styles";
import FocusSection from "./focus-section/focus-section";
import LabelAndHintSection from "./label-and-hint-section";

const Step3 = ({}: {}) => {
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_3;

  return (
    <Stack spacing={styles.SPACING} direction="column" alignItems="center">
      <LabelAndHintSection />
      <FocusSection />
    </Stack>
  );
};

export default Step3;
