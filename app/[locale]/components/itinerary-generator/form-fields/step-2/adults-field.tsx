import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { isValidIntegerRegex } from "@/utils/itineraryGeneratorValidation";
import { Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

const AdultsField = () => {
  const { fields } = useItineraryGenerator();

  const t = useTranslations("home.itineraryGenerator.step2");

  const numAdultsValidation = (numAdultsInput: number) => {
    const isValid = numAdultsInput >= 1;
    return isValid ? true : t("adultsErrorMessage");
  };

  return (
    <Stack
      spacing={0}
      direction="column"
      alignItems="flex-start"
      sx={{ width: "100%" }}
    >
      <Text text={t("adults")} variant={TypographyVariant.h5} bold={true} />
      <Controller
        name={"numPeopleTravelling.adults"}
        control={fields.control}
        rules={{
          validate: numAdultsValidation,
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...fields.register("numPeopleTravelling.adults")}
            variant="outlined"
            onChange={(event) => {
              const value = event.target.value;
              field.onChange(value);
              fields.trigger("numPeopleTravelling.adults");
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: isValidIntegerRegex(),
            }}
            error={fieldState.invalid}
            helperText={fieldState.invalid ? t("adultsErrorMessage") : ""}
            fullWidth
          />
        )}
      />
    </Stack>
  );
};

export default AdultsField;
