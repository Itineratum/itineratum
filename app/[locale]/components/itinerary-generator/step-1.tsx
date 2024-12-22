import colorsConst from "@/constants/pages/colors.json";
import {
  GenerateItineraryFormData,
  UserRequestedDestination,
} from "@/constants/types/formData/generateItineraryFormData";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, Button, Grid, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { UseFormReturn } from "react-hook-form";
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

  const locationFields = () => {
    const [destinations, setDestinations] = useState<
      UserRequestedDestination[]
    >(fields.getValues(userRequestedDestinations) || []);
    const [currentDestination, setCurrentDestination] = useState<string>("");

    useEffect(() => {
      const formDestinations =
        fields.getValues(userRequestedDestinations) || [];
      setDestinations(formDestinations);
    }, [fields]);

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
        if (currentDestination.trim() === "") return;

        const destination: UserRequestedDestination = {
          name: currentDestination,
          startDate: dayjs(),
          endDate: dayjs().add(1, "day"),
        };
        setDestinations((prevDestinations) => {
          const updatedDestinations = [...prevDestinations, destination];
          fields.setValue(userRequestedDestinations, updatedDestinations, {
            shouldValidate: true,
            shouldDirty: true,
          });
          return updatedDestinations;
        });
        setCurrentDestination("");
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
        // <Box sx={{ maxHeight: "20vh", overflowY: "auto" }}>
        <Box>
          {fields
            .getValues(userRequestedDestinations)
            .map((destination, index) => (
              <DestinationItem
                index={index}
                destination={destination}
                destinations={destinations}
                setDestinations={setDestinations}
                fields={fields}
              />
            ))}
        </Box>
      );
    };

    return (
      <Grid item xs={6}>
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
