import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { CONTACT_US_STYLES } from "../styles";

const SubmitButton = () => {
  const { isSubmitting, rating, feedbackCategory, thoughtsSuggestions } =
    useFeedbackForm();

  const t = useTranslations("contactUs.feedbackForm");
  const styles = CONTACT_US_STYLES.FEEDBACK_FORM.SUBMIT_BUTTON;

  const isDisabled =
    isSubmitting ||
    !rating ||
    !feedbackCategory ||
    !(thoughtsSuggestions && thoughtsSuggestions.trim());

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isDisabled}
      >
        {isSubmitting ? (
          <Stack
            direction="row"
            display="flex"
            alignItems="center"
            spacing={styles.SPACING}
          >
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
            <Text
              text={t("submitting")}
              variant={TypographyVariant.button}
              bold={false}
            />
          </Stack>
        ) : (
          t("submit")
        )}
      </Button>
    </Box>
  );
};

export default SubmitButton;
