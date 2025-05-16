import { GenerateItineraryStep } from "@/constants/enums/generateItinerary";
import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { HOME_STYLES } from "../../styles";
import StepDescription from "./step-description";
import StepLabels from "./step-labels";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";

const ItineraryGenerationSteps = ({}: {}) => {
  const { generationStep } = useItineraryGenerator();

  const [
    generatingItineraryStepDescriptionIndex,
    setGeneratingitineraryStepDescriptionIndex,
  ] = useState<number>(0);

  const t = useTranslations("home.itineraryGenerator.generationSteps");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.GENERATION_STEPS;

  const generatingItineraryStepDescriptions = [
    t("generatingItineraryDescription0"),
    t("generatingItineraryDescription1"),
    t("generatingItineraryDescription2"),
    t("generatingItineraryDescription3"),
  ];

  useEffect(() => {
    if (
      generationStep === GenerateItineraryStep.generatingItinerary ||
      generationStep === GenerateItineraryStep.generationComplete
    ) {
      const interval = setInterval(() => {
        setGeneratingitineraryStepDescriptionIndex(
          (prevIndex) =>
            (prevIndex + 1) % generatingItineraryStepDescriptions.length
        );
      }, styles.INTERVAL_DURATION);
      return () => clearInterval(interval);
    }
  }, [generationStep]);

  return (
    generationStep !== GenerateItineraryStep.inputting && (
      <Box mt={styles.VERTICAL_MARGIN} mb={styles.VERTICAL_MARGIN}>
        <Stack direction="column" spacing={styles.SPACING}>
          <StepLabels />
          <StepDescription
            text={
              generatingItineraryStepDescriptions[
                generatingItineraryStepDescriptionIndex
              ]
            }
          />
        </Stack>
      </Box>
    )
  );
};

export default ItineraryGenerationSteps;
