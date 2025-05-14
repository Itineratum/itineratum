import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { FeedbackFormData } from "@/constants/types/formData/feedbackFormData";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import Dropzone from "react-dropzone";
import { ControllerRenderProps } from "react-hook-form";
import { CONTACT_US_STYLES } from "../styles";

const FileInput = ({
  field,
}: {
  field: ControllerRenderProps<FeedbackFormData, "files">;
}) => {
  const { isSubmitting, files } = useFeedbackForm();

  const t = useTranslations("contactUs.feedbackForm");
  const styles = CONTACT_US_STYLES.FEEDBACK_FORM;

  const handleOnDrop = (acceptedFiles: any) => {
    return field.onChange(acceptedFiles);
  };

  return (
    <Stack direction="column" spacing={styles.FIELD_SPACING}>
      <Dropzone
        onDrop={handleOnDrop}
        disabled={isSubmitting}
        accept={{
          "image/png": [".png", ".PNG"],
          "image/jpg": [".jpg", ".JPG"],
          "application/pdf": [".pdf", ".PDF"],
          "audio/mpeg": [".mp3", ".MP3"],
          "video/mp4": [".mp4", ".MP4"],
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <Box {...getRootProps()} sx={styles.FILE_INPUT_SX}>
            <input {...getInputProps()} />
            <Text
              text={t("uploadInstructions")}
              variant={TypographyVariant.body1}
              bold={false}
            />
          </Box>
        )}
      </Dropzone>
      {files && files.length > 0 && (
        <Box>
          <Text
            text={t("uploadedFiles") + ":"}
            variant={TypographyVariant.body1}
            bold={true}
          />
          {files.map((file: File, index: any) => (
            <Text
              key={index}
              text={file.name}
              variant={TypographyVariant.body1}
              bold={false}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
};

export default FileInput;
