import Text from "@/components/atoms/text";
import { GenerateItineraryStep } from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Box, Stack } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function ItineraryGenerationSteps({
  generationStep,
}: {
  generationStep: GenerateItineraryStep;
}) {
  const t = useTranslations("home.itineraryGenerator.generationSteps");

  const [
    generatingItineraryStepDescriptionIndex,
    setGeneratingitineraryStepDescriptionIndex,
  ] = useState<number>(0);

  const verticalMargin = 2;
  const spacing = 4;
  const steps = [
    GenerateItineraryStep.validating,
    GenerateItineraryStep.searchingHotels,
    GenerateItineraryStep.searchingFlights,
    GenerateItineraryStep.generatingItinerary,
  ];
  const activeStep =
    generationStep === GenerateItineraryStep.generationComplete
      ? steps.length
      : steps.findIndex((step) => generationStep === step);
  const generatingItineraryStepDescriptions = [
    t("generatingItineraryDescription0"),
    t("generatingItineraryDescription1"),
    t("generatingItineraryDescription2"),
    t("generatingItineraryDescription3"),
  ];
  const generatingItineraryStepDescriptionIntervalDuration = 3000;

  useEffect(() => {
    if (
      generationStep === GenerateItineraryStep.generatingItinerary ||
      generationStep === GenerateItineraryStep.generationComplete
    ) {
      const interval = setInterval(() => {
        setGeneratingitineraryStepDescriptionIndex(
          (prevIndex) =>
            (prevIndex + 1) % generatingItineraryStepDescriptions.length,
        );
      }, generatingItineraryStepDescriptionIntervalDuration);
      return () => clearInterval(interval);
    }
  }, [generationStep]);

  const stepLabels = () => {
    return (
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={step}>
            <StepLabel>
              <Text
                text={t(`${step}`)}
                variant={
                  activeStep === index
                    ? TypographyVariant.h6
                    : TypographyVariant.body1
                }
                bold={activeStep === index}
                color={
                  activeStep === index
                    ? colorsConst.palette.text.primary
                    : colorsConst.palette.text.grey
                }
              />
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  };

  const stepDescription = () => {
    return (
      (generationStep === GenerateItineraryStep.generatingItinerary ||
        generationStep === GenerateItineraryStep.generationComplete) && (
        <Box display="flex" justifyContent="center">
          <Text
            text={
              generatingItineraryStepDescriptions[
                generatingItineraryStepDescriptionIndex
              ]
            }
            variant={TypographyVariant.h6}
            bold={false}
          />
        </Box>
      )
    );
  };

  return (
    generationStep !== GenerateItineraryStep.inputting && (
      <Box mt={verticalMargin} mb={verticalMargin}>
        <Stack direction="column" spacing={spacing}>
          {stepLabels()}
          {stepDescription()}
        </Stack>
      </Box>
    )
  );
}
