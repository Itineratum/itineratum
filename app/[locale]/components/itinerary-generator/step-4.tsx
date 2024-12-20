import Text from "@/components/atoms/text";
import {
  GenerateItineraryFocus,
  GenerateItineraryPreferredTransport,
} from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

const Step4 = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step4");
  const spacing: number = 4;

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
      fields.setValue("preferredTransport", selectedTransport);
    };

    const radioButton = (value: GenerateItineraryPreferredTransport) => {
      return (
        <FormControlLabel
          value={value}
          control={<Radio sx={{ color: "black" }} />}
          label={value}
        />
      );
    };

    return (
      <RadioGroup onChange={handleOnChange}>
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
    <Stack spacing={spacing} direction="row" alignItems="center">
      {labelSection()}
      {preferredTransportRadioSection()}
    </Stack>
  );
};

export default Step4;
