import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { Rating, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { CONTACT_US_STYLES } from "../styles";

const RatingField = () => {
  const { control } = useFeedbackForm();

  const t = useTranslations("contactUs.feedbackForm");
  const styles = CONTACT_US_STYLES.FEEDBACK_FORM;

  return (
    <Controller
      name={"rating"}
      control={control}
      render={({ field }) => (
        <Stack direction="column" spacing={styles.FIELD_SPACING}>
          <Text
            text={t("rateExperience")}
            variant={TypographyVariant.h6}
            bold={false}
          />
          <Rating
            {...field}
            value={Number(field.value)}
            onChange={(_, value) => field.onChange(value)}
            size="large"
          />
        </Stack>
      )}
    />
  );
};

export default RatingField;
