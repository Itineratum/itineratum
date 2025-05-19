import Text from "@/components/atoms/text";
import { Currency } from "@/constants/enums/currency";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAdjustBudgetDialog } from "@/hooks/useAdjustBudgetDialog";
import { isValidIntegerRegex } from "@/utils/itineraryGeneratorValidation";
import { Box, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { ITINERARY_STYLES } from "../../styles";

const BudgetField = () => {
  const { fields, currency } = useAdjustBudgetDialog();

  const t = useTranslations("itinerary.adjustBudgetDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.ADJUST_BUDGET_DIALOG;

  const budgetValidation = (budgetInput: number) => {
    const isValid = budgetInput > 0;
    return isValid ? true : t("budgetErrorMessage");
  };

  return (
    <Box display="flex" alignItems="center">
      <Box mr={styles.TEXT_LABEL_MARGIN_RIGHT}>
        <Text
          text={
            t("budget") +
            ": " +
            Currency[currency as unknown as keyof typeof Currency]
          }
          variant={TypographyVariant.body1}
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
            sx={{ width: styles.WIDTH }}
          />
        )}
      />
    </Box>
  );
};

export default BudgetField;
