import colorsConst from "@/constants/pages/colors.json";
import {
  GenerateItineraryFormData,
  UserRequestedDestination,
} from "@/constants/types/formData/generateItineraryFormData";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, Button, Grid, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { UseFormReturn, useWatch } from "react-hook-form";
import DateFields from "./date-field";
import DestinationItem from "./destination-item";
import { DestinationField, OriginField } from "./location-fields";

const Step1 = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step1");
  const spacing: number = 4;
  const userRequestedDestinations = "userRequestedDestinations";

  // watch form value changes for real-time updates
  const destinations = useWatch({
    control: fields.control,
    name: userRequestedDestinations,
    defaultValue: [],
  });
  const [currentDestination, setCurrentDestination] = useState<string>("");

  const locationFields = () => {
    const originField = () => {
      return <OriginField fields={fields} />;
    };

    const destinationField = () => {
      return (
        <DestinationField
          destination={currentDestination}
          setDestination={setCurrentDestination}
        />
      );
    };

    const addLocationButton = () => {
      const handleOnClick = () => {
        const tripStartDate =
          fields.getValues("startDate") || dayjs().startOf("day");

        if (currentDestination.trim() === "") return;

        const destination: UserRequestedDestination = {
          name: currentDestination,
          startDate: tripStartDate,
          endDate: tripStartDate,
        };
        var updatedDestinations = [...destinations, destination];

        // reset the startDate and endDate for all destinations
        updatedDestinations = updatedDestinations.map((destination) => ({
          ...destination,
          startDate: tripStartDate,
          endDate: tripStartDate,
        }));

        fields.setValue(userRequestedDestinations, updatedDestinations, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setCurrentDestination("");
        fields.trigger("startDate");
        fields.trigger("endDate");
      };

      return (
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <Button
            variant="text"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            sx={{ color: colorsConst.palette.text.primary }}
            onClick={handleOnClick}
            disabled={currentDestination === ""}
          >
            {t("addLocation")}
          </Button>
        </Box>
      );
    };

    const destinationsSection = () => {
      return (
        <Box>
          {destinations.map((destination, index) => (
            <DestinationItem
              key={index}
              index={index}
              destination={destination}
              destinations={destinations}
              fields={fields}
            />
          ))}
        </Box>
      );
    };

    return (
      <Grid item xs={12} md={6}>
        <Stack spacing={spacing} direction="column" alignItems="center">
          {originField()}
          {destinationField()}
        </Stack>
        {addLocationButton()}
        {destinationsSection()}
      </Grid>
    );
  };

  const dateFields = () => {
    return <DateFields fields={fields} />;
  };

  return (
    <Grid container spacing={spacing} alignItems="flex-start">
      {locationFields()}
      {dateFields()}
    </Grid>
  );
};

export default Step1;
