import { HOME_STYLES } from "@/app/[locale]/components/styles";
import { UserRequestedDestination } from "@/constants/types/formData/generateItineraryFormData";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { useStep5 } from "@/hooks/useStep5";
import { MenuItem, Select, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import DatesIndicator from "./dates-indicator";

const DaysAllocationItem = ({
  destination,
}: {
  destination: UserRequestedDestination;
}) => {
  const { fields } = useItineraryGenerator();
  const { daysAllocated, setDaysAllocated, totalDays } = useStep5();

  const t = useTranslations("home.itineraryGenerator.step5");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_5;

  const handleDaysAllocationChange = (
    destination: UserRequestedDestination,
    numOfDaysToAllocate: number,
  ) => {
    setDaysAllocated((prevDaysAllocated) => {
      const updatedDaysAllocated = {
        ...prevDaysAllocated,
        [destination.name]: numOfDaysToAllocate,
      };

      // calculate cumulative start dates for all destinations
      let cumulativeDays = 0;
      const destinations = fields.getValues("userRequestedDestinations");

      destinations.forEach((dest: UserRequestedDestination, index: number) => {
        const allocatedDays = updatedDaysAllocated[dest.name] || 0;

        const startDate = fields
          .getValues("startDate")
          .add(cumulativeDays, "day");
        const endDate = startDate.add(allocatedDays - 1, "day");

        fields.setValue(
          // @ts-ignore
          `${"userRequestedDestinations"}[${index}].startDate`,
          startDate,
        );
        fields.setValue(
          // @ts-ignore
          `${"userRequestedDestinations"}[${index}].endDate`,
          endDate,
        );

        cumulativeDays += allocatedDays;
      });

      return updatedDaysAllocated;
    });
  };

  const getAvailableDays = (currentDestination: string) => {
    const daysAlreadyAllocated = Object.entries(daysAllocated)
      .map((destinationDaysAllocated) => {
        const destination = destinationDaysAllocated[0];
        const numOfDaysAllocated = destinationDaysAllocated[1];

        if (destination !== null && destination !== currentDestination) {
          return numOfDaysAllocated;
        } else return 0;
      })
      .reduce((accummulator, currentValue) => accummulator + currentValue);

    return totalDays - daysAlreadyAllocated;
  };

  return (
    <Stack direction="row" alignItems="center" spacing={styles.SPACING - 2}>
      <Select
        value={daysAllocated[destination.name]}
        onChange={(event) => {
          handleDaysAllocationChange(destination, Number(event.target.value));
        }}
        displayEmpty
      >
        {/* select days hint */}
        <MenuItem value="" disabled>
          {t("selectDays")}
        </MenuItem>
        {Array.from(
          Array(getAvailableDays(destination.name)),
          (_, i) => i + 1,
        ).map((daysToAllocate) => (
          <MenuItem key={daysToAllocate} value={daysToAllocate}>
            {daysToAllocate}
          </MenuItem>
        ))}
      </Select>
      <DatesIndicator destination={destination} />
    </Stack>
  );
};

export default DaysAllocationItem;
