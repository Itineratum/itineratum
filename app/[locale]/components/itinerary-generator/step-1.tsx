import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import { Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { UseFormReturn } from "react-hook-form";
import DateFields from "./date-field";
import LocationField from "./location-field";

const Step1 = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step1");

  const spacing: number = 4;

  const locationFields = () => {
    const fromField = () => {
      return (
        <LocationField
          textLabel={t("from")}
          label={t("fromDestinationDescription")}
          fieldId="startLocation"
          fields={fields}
        />
      );
    };

    const destinationField = () => {
      return (
        <LocationField
          textLabel={t("destination")}
          label={t("destinationDescription")}
          fieldId="userRequestedDestinations"
          fields={fields}
        />
      );
    };

    return (
      <Grid item xs={6}>
        <Stack spacing={spacing} direction="column" alignItems="center">
          {fromField()}
          {destinationField()}
        </Stack>
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
