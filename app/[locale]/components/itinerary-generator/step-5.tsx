import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import {
  GenerateItineraryFormData,
  UserRequestedDestination,
} from "@/constants/types/formData/generateItineraryFormData";
import {
  Box,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { destinationBoxSx } from "./destination-item";

const Step5 = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step5");
  const spacing: number = 4;
  const userRequestedDestinations = "userRequestedDestinations";
  const leftSection: number = 7;
  const rightSection: number = 12 - leftSection;

  const [totalDays, setTotalDays] = useState<number>(() => {
    const startDate = fields.getValues("startDate");
    const endDate = fields.getValues("endDate");
    return endDate.diff(startDate, "day") + 1;
  });
  const [daysAllocated, setDaysAllocated] = useState<{
    [key: string]: number;
  }>(() => {
    const destinations = fields.getValues(userRequestedDestinations);
    const initialAllocation: { [key: string]: number } = {};
    destinations.forEach((destination: UserRequestedDestination) => {
      initialAllocation[destination.name] = 0;
    });
    return initialAllocation;
  });

  useEffect(() => {
    // synchronize daysAllocated state with form values on initial load
    const initialDaysAllocated: { [key: string]: number } = {};
    const destinations = fields.getValues(userRequestedDestinations);
    destinations.forEach((destination: UserRequestedDestination) => {
      const destinationStartDate = destination.startDate;
      const destinationEndDate = destination.endDate;
      initialDaysAllocated[destination.name] =
        destinationEndDate.diff(destinationStartDate, "day") + 1;
    });
    setDaysAllocated(initialDaysAllocated);
  }, [fields.watch(userRequestedDestinations)]);

  const destinationLabel = () => {
    const emptySpace = () => {
      return (
        <Text
          text={"."}
          variant={TypographyVariant.h6}
          bold={true}
          color={colorsConst.palette.text.secondary}
        />
      );
    };

    return (
      <Stack spacing={spacing + 1} direction="column">
        {emptySpace()}
        <Text
          text={t("destination") + ": "}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Stack>
    );
  };

  const daysAllocationSection = () => {
    const labelSection = () => {
      const emptySpace = () => {
        return (
          <Text
            text={"."}
            variant={TypographyVariant.h6}
            bold={true}
            color={colorsConst.palette.text.secondary}
          />
        );
      };

      return (
        <Box sx={{ width: "100%" }}>
          <Grid container direction="row">
            <Grid item xs={leftSection}>
              {emptySpace()}
            </Grid>
            <Grid item xs={rightSection}>
              <Text
                text={t("allocation")}
                variant={TypographyVariant.h6}
                bold={true}
              />
            </Grid>
          </Grid>
        </Box>
      );
    };

    const destinationItems = () => {
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
          const destinations = fields.getValues(userRequestedDestinations);

          destinations.forEach(
            (dest: UserRequestedDestination, index: number) => {
              const allocatedDays = updatedDaysAllocated[dest.name] || 0;

              const startDate = fields
                .getValues("startDate")
                .add(cumulativeDays, "day");
              const endDate = startDate.add(allocatedDays - 1, "day");

              fields.setValue(
                // @ts-ignore
                `${userRequestedDestinations}[${index}].startDate`,
                startDate,
              );
              fields.setValue(
                // @ts-ignore
                `${userRequestedDestinations}[${index}].endDate`,
                endDate,
              );

              cumulativeDays += allocatedDays;
            },
          );

          return updatedDaysAllocated;
        });
      };

      const selectDaysHint = () => {
        return (
          <MenuItem value="" disabled>
            {t("selectDays")}
          </MenuItem>
        );
      };

      const numbering = (index: number) => {
        const rightMargin: number = 2;

        return (
          <Box sx={{ mr: rightMargin }}>
            <Text
              text={index + 1 + ")"}
              variant={TypographyVariant.h6}
              bold={false}
            />
          </Box>
        );
      };

      const datesIndicator = (destination: UserRequestedDestination) => {
        const format = "D MMM YYYY";
        const destinationItem = fields
          .getValues(userRequestedDestinations)
          .filter((dest) => dest.name === destination.name);
        const destinationStartDate = destinationItem[0].startDate;
        const destinationEndDate = destinationItem[0].endDate;
        const numOfDays =
          destinationEndDate.diff(destinationStartDate, "days") + 1;

        return (
          <Text
            text={
              numOfDays === 1
                ? `${destinationStartDate.format(format)}`
                : `${destinationStartDate.format(format)} to ${destinationEndDate.format(format)}`
            }
            variant={TypographyVariant.body1}
            bold={true}
          />
        );
      };

      const daysAllocationItem = (destination: UserRequestedDestination) => {
        return (
          <Stack direction="row" alignItems="center" spacing={spacing - 2}>
            <Select
              value={daysAllocated[destination.name]}
              onChange={(event) => {
                handleDaysAllocationChange(
                  destination,
                  Number(event.target.value),
                );
              }}
              displayEmpty
            >
              {selectDaysHint()}
              {Array.from(
                Array(getAvailableDays(destination.name)),
                (_, i) => i + 1,
              ).map((daysToAllocate) => (
                <MenuItem key={daysToAllocate} value={daysToAllocate}>
                  {daysToAllocate}
                </MenuItem>
              ))}
            </Select>
            {datesIndicator(destination)}
          </Stack>
        );
      };

      const destinationItem = (
        destination: UserRequestedDestination,
        index: number,
      ) => {
        return (
          <Grid container sx={destinationBoxSx} key={index}>
            <Grid
              item
              xs={leftSection}
              sx={{ display: "flex", direction: "row", alignItems: "center" }}
            >
              {numbering(index)}
              <Text
                text={destination.name}
                variant={TypographyVariant.h6}
                bold={false}
              />
            </Grid>
            <Grid item xs={rightSection} sx={{ display: "flex" }}>
              {daysAllocationItem(destination)}
            </Grid>
          </Grid>
        );
      };

      return (
        <Box sx={{ width: "100%" }}>
          {fields
            .getValues(userRequestedDestinations)
            .map((destination, index) => destinationItem(destination, index))}
        </Box>
      );
    };

    return (
      <Stack
        spacing={spacing}
        direction="column"
        width="100%"
        sx={{ display: "flex", alignItems: "center" }}
      >
        {labelSection()}
        {destinationItems()}
      </Stack>
    );
  };

  return (
    <Stack
      direction="row"
      spacing={spacing}
      sx={{ display: "flex", alignItems: "flex-start" }}
    >
      {destinationLabel()}
      {daysAllocationSection()}
    </Stack>
  );
};

export default Step5;
