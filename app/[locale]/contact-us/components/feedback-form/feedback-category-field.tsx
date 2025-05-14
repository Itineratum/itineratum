import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { FeedbackCategory } from "@/constants/types/formData/feedbackFormData";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { MenuItem, Select, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { CONTACT_US_STYLES } from "../styles";

const FeedbackCategoryField = () => {
  const { control } = useFeedbackForm();

  const t = useTranslations("contactUs.feedbackForm");
  const styles = CONTACT_US_STYLES.FEEDBACK_FORM;

  return (
    <Controller
      name={"feedbackCategory"}
      control={control}
      render={({ field }) => (
        <Stack direction="column" spacing={styles.FIELD_SPACING}>
          <Text
            text={t("feedbackCategory")}
            variant={TypographyVariant.h6}
            bold={false}
          />
          <Select {...field} fullWidth>
            {Object.values(FeedbackCategory).map((feedbackCategory) => (
              <MenuItem key={feedbackCategory} value={feedbackCategory}>
                {feedbackCategory}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      )}
    />
  );
};

export default FeedbackCategoryField;
