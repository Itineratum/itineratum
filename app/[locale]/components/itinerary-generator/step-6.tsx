import Text from "@/components/atoms/text";
import { GenerateItineraryOtherRequirements } from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

const Step6 = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step6");
  const spacing: number = 4;
  const otherRequirements = "otherRequirements";

  const labelSection = () => {
    return (
      <Text
        text={t("otherRequirements") + ": "}
        variant={TypographyVariant.h4}
        bold={true}
      />
    );
  };

  const otherRequirementsCheckboxSection = () => {
    const handleOnChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      requirement: keyof typeof GenerateItineraryOtherRequirements,
    ) => {
      const currentValues = fields.getValues(otherRequirements) || {};
      fields.setValue(otherRequirements, {
        ...currentValues,
        [requirement]: event.target.checked,
      });
    };

    const checkbox = (
      value: keyof typeof GenerateItineraryOtherRequirements,
    ) => {
      const currentValues = fields.getValues(otherRequirements) || {};
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={currentValues[value] || false}
              onChange={(event) => handleOnChange(event, value)}
              sx={{ color: "black" }}
            />
          }
          label={
            <Text
              text={GenerateItineraryOtherRequirements[value]}
              variant={TypographyVariant.h4}
              bold={true}
            />
          }
        />
      );
    };

    return (
      <Stack spacing={spacing} direction="column">
        {Object.keys(GenerateItineraryOtherRequirements).map((key) =>
          checkbox(key as keyof typeof GenerateItineraryOtherRequirements),
        )}
      </Stack>
    );
  };

  return (
    <Stack
      spacing={spacing}
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
    >
      {labelSection()}
      {otherRequirementsCheckboxSection()}
    </Stack>
  );
};

export default Step6;
