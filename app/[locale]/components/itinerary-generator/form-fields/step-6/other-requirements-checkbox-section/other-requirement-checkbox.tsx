import Text from "@/components/atoms/text";
import { GenerateItineraryOtherRequirement } from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { Checkbox, FormControlLabel } from "@mui/material";

const OtherRequirementCheckbox = ({
  value,
}: {
  value: keyof typeof GenerateItineraryOtherRequirement;
}) => {
  const { fields } = useItineraryGenerator();

  const currentValues = fields.getValues("otherRequirements") || {};

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    requirement: keyof typeof GenerateItineraryOtherRequirement
  ) => {
    const currentValues = fields.getValues("otherRequirements") || {};
    fields.setValue("otherRequirements", {
      ...currentValues,
      [requirement]: event.target.checked,
    });
  };

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
          text={GenerateItineraryOtherRequirement[value]}
          variant={TypographyVariant.h4}
          bold={true}
        />
      }
    />
  );
};

export default OtherRequirementCheckbox;
