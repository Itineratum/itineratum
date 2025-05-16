import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { Box } from "@mui/material";
import { HOME_STYLES } from "../../styles";
import GenerateButton from "./generate-button";
import NextButton from "./next-button";
import PreviousButton from "./previous-button";

const NavigationButtons = () => {
  const { activeStep, generatingItinerary } = useItineraryGenerator();

  const styles = HOME_STYLES.ITINERARY_GENERATOR;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: activeStep === 0 ? "flex-end" : "space-between",
        width: "100%",
        marginTop: styles.MARGIN_TOP,
        flexDirection: {
          xs: generatingItinerary ? "column" : "row",
          md: "row",
        },
        gap: 3,
      }}
    >
      <PreviousButton />
      <NextButton />
      <GenerateButton />
    </Box>
  );
};

export default NavigationButtons;
