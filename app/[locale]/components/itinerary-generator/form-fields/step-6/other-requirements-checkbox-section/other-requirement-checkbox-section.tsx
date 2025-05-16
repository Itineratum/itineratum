import { HOME_STYLES } from "@/app/[locale]/components/styles";
import { GenerateItineraryOtherRequirement } from "@/constants/enums/generateItinerary";
import { Stack } from "@mui/material";
import OtherRequirementCheckbox from "./other-requirement-checkbox";

const OtherRequirementCheckboxSection = () => {
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_6;

  return (
    <Stack spacing={styles.SPACING} direction="column">
      {Object.keys(GenerateItineraryOtherRequirement).map((key) => {
        return (
          <OtherRequirementCheckbox
            value={key as keyof typeof GenerateItineraryOtherRequirement}
          />
        );
      })}
    </Stack>
  );
};

export default OtherRequirementCheckboxSection;
