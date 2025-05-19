import Text from "@/components/atoms/text";
import { GenerateItineraryStep } from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import { Box } from "@mui/material";

const StepDescription = ({
  text,
  generationStep,
}: {
  text: string;
  generationStep: GenerateItineraryStep;
}) => {
  return (
    (generationStep === GenerateItineraryStep.generatingItinerary ||
      generationStep === GenerateItineraryStep.generationComplete) && (
      <Box display="flex" justifyContent="center">
        <Text text={text} variant={TypographyVariant.h6} bold={false} />
      </Box>
    )
  );
};

export default StepDescription;
