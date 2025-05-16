import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { useStep2 } from "@/hooks/useStep2";
import { isValidIntegerRegex } from "@/utils/itineraryGeneratorValidation";
import { Box, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { HOME_STYLES } from "../../../styles";

const BudgetField = () => {
  const { fields } = useItineraryGenerator();
  const { currency } = useStep2();

  const t = useTranslations("home.itineraryGenerator.step2");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_2;

  const budgetValidation = (budgetInput: number) => {
    const isValid = budgetInput > 0;
    return isValid ? true : t("budgetErrorMessage");
  };

  return (
    <Box
      display="flex"
      sx={{
        width: "100%",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: styles.MOBILE_SPACING, md: 0 },
        alignItems: { xs: "flex-start", md: "center" },
      }}
    >
      <Box
        mr={styles.TEXT_LABEL_MARGIN_RIGHT}
        display="flex"
        sx={{
          width: { xs: "100%", md: styles.BUDGET_FIELD_WIDTH },
          flexShrink: 0,
        }}
      >
        <Text
          text={t("budget") + ": " + currency?.toUpperCase()}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Box>
      <Controller
        name={"budget"}
        control={fields.control}
        rules={{
          validate: budgetValidation,
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...fields.register("budget")}
            variant="outlined"
            label={t("budgetDescription")}
            InputLabelProps={{
              style: {
                color: colorsConst.palette.text.grey,
                fontSize: "12px",
              },
            }}
            onChange={(event) => {
              const value = event.target.value;
              field.onChange(value);
              fields.trigger("budget");
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: isValidIntegerRegex(),
            }}
            error={fieldState.invalid}
            helperText={fieldState.invalid ? t("budgetErrorMessage") : ""}
            fullWidth
          />
        )}
      />
    </Box>
  );
};

export default BudgetField;
