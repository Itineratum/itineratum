import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { isValidIntegerRegex } from "@/utils/itineraryGeneratorValidation";
import { Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

const ChildrenField = () => {
  const { fields } = useItineraryGenerator();

  const t = useTranslations("home.itineraryGenerator.step2");

  const numChildrenValidation = (numChildrenInput: number) => {
    const isValid = numChildrenInput >= 0;
    return isValid ? true : t("childrenErrorMessage");
  };

  return (
    <Stack spacing={0} direction="column" alignItems="flex-start" width="100%">
      <Text text={t("children")} variant={TypographyVariant.h5} bold={true} />
      <Controller
        name={"numPeopleTravelling.children"}
        control={fields.control}
        rules={{
          validate: numChildrenValidation,
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...fields.register("numPeopleTravelling.children")}
            variant="outlined"
            onChange={(event) => {
              const value = event.target.value;
              field.onChange(value);
              fields.trigger("numPeopleTravelling.children");
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: isValidIntegerRegex(),
            }}
            error={fieldState.invalid}
            helperText={fieldState.invalid ? t("childrenErrorMessage") : ""}
            fullWidth
          />
        )}
      />
    </Stack>
  );
};

export default ChildrenField;
