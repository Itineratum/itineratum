import Text from "@/components/atoms/text";
import { GenerateItineraryStep } from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { Box } from "@mui/material";

const StepDescription = ({ text }: { text: string }) => {
  const { generationStep } = useItineraryGenerator();

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
