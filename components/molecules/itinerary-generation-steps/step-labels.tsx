import Text from "@/components/atoms/text";
import { GenerateItineraryStep } from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Step, StepLabel, Stepper } from "@mui/material";
import { useTranslations } from "next-intl";

const StepLabels = ({
  generationStep,
}: {
  generationStep: GenerateItineraryStep;
}) => {
  const t = useTranslations("home.itineraryGenerator.generationSteps");

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

  return (
    <Stepper
      activeStep={activeStep}
      sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
    >
      {steps.map((step, index) => (
        <Step key={index}>
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

export default StepLabels;
