import Text from "@/components/atoms/text";
import { GenerateItineraryPreferredTransport } from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import { Box, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

const Step4 = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step4");
  const spacing: number = 4;
  const preferredTransport = "preferredTransport";

  const labelSection = () => {
    return (
      <Text
        text={t("transport") + ": "}
        variant={TypographyVariant.h4}
        bold={true}
      />
    );
  };

  const preferredTransportRadioSection = () => {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedTransport = event.target
        .value as GenerateItineraryPreferredTransport;
      fields.setValue(preferredTransport, selectedTransport);
    };

    const radioButton = (value: GenerateItineraryPreferredTransport) => {
      return (
        <FormControlLabel
          value={value.toLowerCase()}
          control={<Radio sx={{ color: "black" }} />}
          label={value}
        />
      );
    };

    return (
      <RadioGroup
        onChange={handleOnChange}
        value={fields.getValues(preferredTransport)}
      >
        <Stack spacing={spacing} direction="row">
          <Stack spacing={spacing} direction="column">
            {radioButton(GenerateItineraryPreferredTransport.car)}
            {radioButton(GenerateItineraryPreferredTransport.train)}
            {radioButton(GenerateItineraryPreferredTransport.bus)}
          </Stack>
          <Stack spacing={spacing} direction="column">
            {radioButton(GenerateItineraryPreferredTransport.walk)}
            {radioButton(GenerateItineraryPreferredTransport.boat)}
          </Stack>
        </Stack>
      </RadioGroup>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: spacing,
        flexDirection: { xs: "column", md: "row" },
        alignItems: "flex-start",
      }}
    >
      {labelSection()}
      {preferredTransportRadioSection()}
    </Box>
  );
};

export default Step4;
