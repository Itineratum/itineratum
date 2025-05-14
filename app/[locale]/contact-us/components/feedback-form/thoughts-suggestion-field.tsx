import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { CONTACT_US_STYLES } from "../styles";

const ThoughtsSuggestionsField = () => {
  const { control } = useFeedbackForm();

  const t = useTranslations("contactUs.feedbackForm");
  const styles = CONTACT_US_STYLES.FEEDBACK_FORM;

  return (
    <Controller
      name={"thoughtsSuggestions"}
      control={control}
      render={({ field }) => (
        <Stack direction="column" spacing={styles.FIELD_SPACING}>
          <Text
            text={t("thoughtsSuggestions")}
            variant={TypographyVariant.h6}
            bold={false}
          />
          <TextField
            {...field}
            fullWidth
            multiline
            rows={4}
            placeholder={t("thoughtsSuggestionsPlaceholder")}
            color="info"
            variant="outlined"
            sx={{ backgroundColor: colorsConst.palette.text.secondary }}
          />
        </Stack>
      )}
    />
  );
};

export default ThoughtsSuggestionsField;
