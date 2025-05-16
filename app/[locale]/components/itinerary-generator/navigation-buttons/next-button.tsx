import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { steps } from "../form-fields/form-fields";

const NextButton = () => {
  const { fields, setDirection, setActiveStep, activeStep, nextButtonEnabled } =
    useItineraryGenerator();

  const t = useTranslations("home.itineraryGenerator");

  // whenever the user adds, removes, or rearranges the destinations, the start and end dates of each destination should be update such that:
  // - the start date of the first destination is the trip start date
  // - the end date of the last destination is the trip end date
  // - the start and end dates of the other destinations (if any) are (as evenly) spread out between the trip start and end dates (not including the start and end dates)
  const handleOnClickForStep1 = () => {
    const destinations = fields.getValues("userRequestedDestinations");
    const tripStartDate = fields.getValues("startDate");
    const tripEndDate = fields.getValues("endDate");
    const totalTripDays = tripEndDate.diff(tripStartDate, "day") + 1;

    if (destinations.length === 1) {
      // single destination gets entire trip duration
      fields.setValue(
        //@ts-ignore
        `userRequestedDestinations[0].startDate`,
        tripStartDate
      );
      //@ts-ignore
      fields.setValue(`userRequestedDestinations[0].endDate`, tripEndDate);
    } else {
      // multiple destinations - distribute days sequentially
      let remainingDays = totalTripDays;
      let currentDate = tripStartDate;

      destinations.forEach((_, index) => {
        const isLast = index === destinations.length - 1;
        // last destination gets all remaining days, others get floor(remaining/destinations left)
        const daysToAllocate = isLast
          ? remainingDays
          : Math.floor(remainingDays / (destinations.length - index));

        fields.setValue(
          //@ts-ignore
          `userRequestedDestinations[${index}].startDate`,
          currentDate
        );
        const endDate = currentDate.add(daysToAllocate - 1, "day");
        fields.setValue(
          //@ts-ignore
          `userRequestedDestinations[${index}].endDate`,
          endDate
        );

        currentDate = endDate.add(1, "day");
        remainingDays -= daysToAllocate;
      });
    }
  };

  const handleOnClick = () => {
    if (activeStep === 0) handleOnClickForStep1();

    setDirection("left");
    setActiveStep((prevStep) => prevStep + 1);
  };

  return (
    activeStep < steps.length - 1 && (
      <Button
        onClick={handleOnClick}
        variant="contained"
        color="primary"
        endIcon={<ArrowForwardOutlinedIcon />}
        disabled={!nextButtonEnabled}
      >
        {t("next")}
      </Button>
    )
  );
};

export default NextButton;
