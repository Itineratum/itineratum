import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import {
  GenerateItineraryFormData,
  UserRequestedDestination,
} from "@/constants/types/formData/generateItineraryFormData";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { Box, Button, Grid, IconButton, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { UseFormReturn } from "react-hook-form";
import DateFields from "./date-field";
import { DestinationField, FromField } from "./location-field";

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
    >([]);
    const [currentDestination, setCurrentDestination] = useState<string>("");

    const fromField = () => {
      return <FromField fields={fields} />;
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
          >
            {t("addLocation")}
          </Button>
        </Box>
      );
    };

    const destinationsSection = () => {
      const destinationBoxSx = {
        border: `1px solid ${colorsConst.palette.primary.main}`,
        borderRadius: "8px",
        padding: "8px",
        marginBottom: "8px",
      };

      const deleteButton = (index: number) => {
        const handleOnClick = () => {
          const updatedDestinations = destinations.filter(
            (_, i) => i !== index,
          );
          setDestinations(updatedDestinations);
          fields.setValue(userRequestedDestinations, updatedDestinations);
        };

        return (
          <IconButton onClick={handleOnClick}>
            <ClearOutlinedIcon />
          </IconButton>
        );
      };

      return (
        <Box sx={{ maxHeight: "20vh", overflowY: "auto" }}>
          {fields
            .getValues(userRequestedDestinations)
            .map((destination, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={destinationBoxSx}
              >
                <Text
                  text={destination.name}
                  variant={TypographyVariant.h6}
                  bold={false}
                />
                {deleteButton(index)}
              </Box>
            ))}
        </Box>
      );
    };

    return (
      <Grid item xs={6}>
        <Stack spacing={spacing} direction="column" alignItems="center">
          {fromField()}
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
