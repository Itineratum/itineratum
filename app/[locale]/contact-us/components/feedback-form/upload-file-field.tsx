import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { CONTACT_US_STYLES } from "../styles";
import FileInput from "./file-input";

const UploadFileField = () => {
  const { control } = useFeedbackForm();

  const t = useTranslations("contactUs.feedbackForm");
  const styles = CONTACT_US_STYLES.FEEDBACK_FORM;

  return (
    <Controller
      name={"files"}
      control={control}
      render={({ field }) => (
        <Stack direction="column" spacing={styles.FIELD_SPACING}>
          {/* label  */}
          <Text
            text={t("uploadFiles")}
            variant={TypographyVariant.h6}
            bold={false}
          />
          {/* instructions  */}
          <Text
            text={t("uploadFilesInstructions")}
            variant={TypographyVariant.body1}
            bold={false}
          />
          <FileInput field={field} />
        </Stack>
      )}
    />
  );
};

export default UploadFileField;
