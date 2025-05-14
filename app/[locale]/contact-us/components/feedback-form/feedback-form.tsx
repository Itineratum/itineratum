"use client";

import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { TypographyVariant } from "@/constants/enums/theme";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { CONTACT_US_STYLES } from "../styles";
import FeedbackCategoryField from "./feedback-category-field";
import RatingField from "./rating-field";
import SubmitButton from "./submit-button";
import ThoughtsSuggestionsField from "./thoughts-suggestion-field";
import UploadFileField from "./upload-file-field";

const FeedbackForm = () => {
  const {
    handleSubmit,
    onSubmit,
    showAlert,
    setShowAlert,
    alertText,
    alertType,
  } = useFeedbackForm();

  const t = useTranslations("contactUs.feedbackForm");
  const styles = CONTACT_US_STYLES.FEEDBACK_FORM;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={styles.SPACING}>
        <Text
          text={t("feedbacks")}
          variant={TypographyVariant.h3}
          bold={false}
        />
        <Text
          text={t("description")}
          variant={TypographyVariant.body1}
          bold={false}
        />
        <RatingField />
        <FeedbackCategoryField />
        <ThoughtsSuggestionsField />
        <UploadFileField />
        <SubmitButton />
        <Alert
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          alertText={alertText}
          alertType={alertType}
        />
      </Stack>
    </form>
  );
};

export default FeedbackForm;
