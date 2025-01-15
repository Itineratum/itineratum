"use client";

import { trpc } from "@/app/_trpc/client";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import {
  FeedbackCategory,
  FeedbackFormData,
} from "@/constants/types/formData/feedbackFormData";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { generateReactHelpers } from "@uploadthing/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Key, useState } from "react";
import Dropzone from "react-dropzone";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";

const FeedbackForm = () => {
  const t = useTranslations("contactUs.feedbackForm");
  const { data: session } = useSession();

  const email = session?.user.email;
  const name = session?.user.name;

  const { control, watch, handleSubmit, reset } = useForm<FeedbackFormData>();

  const ratingId = "rating";
  const feedbackCategoryId = "feedbackCategory";
  const thoughtsSuggestionsId = "thoughtsSuggestions";
  const filesId = "files";
  const rating = watch(ratingId);
  const feedbackCategory = watch(feedbackCategoryId);
  const thoughtsSuggestions = watch(thoughtsSuggestionsId);
  const files = watch(filesId);

  const spacing = 4;

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileUrls: string[] = [];

  const feedbackNotificationEmail =
    trpc.feedbackForm.feedbackNotificationEmail.useMutation();
  const feedbackReceivedEmail =
    trpc.feedbackForm.feedbackReceivedEmail.useMutation();

  const { useUploadThing } = generateReactHelpers<OurFileRouter>();
  const { startUpload } = useUploadThing("feedbackFormFileUploader", {
    onBeforeUploadBegin: (files) => {
      return files.map((file: any) => {
        const fileName = `feedback_${email ?? ""}_${file.name}_${file.path}`;
        const fileType = file.type;
        return new File([file], fileName, { type: fileType });
      });
    },
  });

  const title = () => {
    return (
      <Text text={t("feedbacks")} variant={TypographyVariant.h3} bold={false} />
    );
  };

  const description = () => {
    return (
      <Text
        text={t("description")}
        variant={TypographyVariant.body1}
        bold={false}
      />
    );
  };

  const ratingField = () => {
    const spacing = 2;

    const label = () => {
      return (
        <Text
          text={t("rateExperience")}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    const ratingInput = (
      field: ControllerRenderProps<FeedbackFormData, "rating">,
    ) => {
      return (
        <Rating
          {...field}
          value={Number(field.value)}
          onChange={(_, value) => field.onChange(value)}
          size="large"
        />
      );
    };

    return (
      <Controller
        name={ratingId}
        control={control}
        render={({ field }) => (
          <Stack direction="column" spacing={spacing}>
            {label()}
            {ratingInput(field)}
          </Stack>
        )}
      />
    );
  };

  const feedbackCategoryField = () => {
    const spacing = 2;

    const label = () => {
      return (
        <Text
          text={t("feedbackCategory")}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    const selectInput = (
      field: ControllerRenderProps<FeedbackFormData, "feedbackCategory">,
    ) => {
      return (
        <Select {...field} fullWidth>
          {Object.values(FeedbackCategory).map((feedbackCategory) => (
            <MenuItem key={feedbackCategory} value={feedbackCategory}>
              {feedbackCategory}
            </MenuItem>
          ))}
        </Select>
      );
    };

    return (
      <Controller
        name={feedbackCategoryId}
        control={control}
        render={({ field }) => (
          <Stack direction="column" spacing={spacing}>
            {label()}
            {selectInput(field)}
          </Stack>
        )}
      />
    );
  };

  const thoughtsSuggestionsField = () => {
    const spacing = 2;

    const label = () => {
      return (
        <Text
          text={t("thoughtsSuggestions")}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    const textInput = (
      field: ControllerRenderProps<FeedbackFormData, "thoughtsSuggestions">,
    ) => {
      return (
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
      );
    };

    return (
      <Controller
        name={thoughtsSuggestionsId}
        control={control}
        render={({ field }) => (
          <Stack direction="column" spacing={spacing}>
            {label()}
            {textInput(field)}
          </Stack>
        )}
      />
    );
  };

  const uploadFileField = () => {
    const spacing = 2;

    const label = () => {
      return (
        <Text
          text={t("uploadFiles")}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    const instructions = () => {
      {
        return (
          <Text
            text={t("uploadFilesInstructions")}
            variant={TypographyVariant.body1}
            bold={false}
          />
        );
      }
    };

    const fileInput = (
      field: ControllerRenderProps<FeedbackFormData, "files">,
    ) => {
      const sx = {
        border: "2px dashed gray",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
      };

      const handleOnDrop = (acceptedFiles: any) => {
        return field.onChange(acceptedFiles);
      };

      return (
        <Stack direction="column" spacing={spacing}>
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
              <Box {...getRootProps()} sx={sx}>
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
              {files.map((file: File, index: Key | null | undefined) => (
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

    return (
      <Controller
        name={filesId}
        control={control}
        render={({ field }) => (
          <Stack direction="column" spacing={spacing}>
            {label()}
            {instructions()}
            {fileInput(field)}
          </Stack>
        )}
      />
    );
  };

  const submitButton = () => {
    const loadingAnimationSize: number = 24;
    const spacing = 2;

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
              spacing={spacing}
            >
              <CircularProgress size={loadingAnimationSize} />
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

  const onSubmit = async (formData: FeedbackFormData) => {
    try {
      setShowAlert(false);
      setIsSubmitting(true);

      if (files && files.length > 0) {
        for (const file of files) {
          const uploadedFileData = await startUpload([file]);

          if (uploadedFileData) {
            const fileUrl = uploadedFileData[0].url;
            fileUrls.push(fileUrl);
          }
        }
      }

      const feedbackNotificationEmailData = {
        userEmail: email,
        userName: name,
        rating,
        feedbackCategory,
        thoughtsSuggestions,
        fileUrls,
      };

      await feedbackNotificationEmail.mutateAsync(
        feedbackNotificationEmailData,
      );

      if (email) {
        const feedbackReceivedEmailData = {
          toEmail: email,
          name: name!,
        };
        await feedbackReceivedEmail.mutateAsync(feedbackReceivedEmailData);
      }

      // reset form values
      reset({
        rating: 0,
        feedbackCategory: null as unknown as FeedbackCategory,
        thoughtsSuggestions: "",
        files: [],
      });

      setIsSubmitting(false);
      setAlertType(AlertType.success);
      setAlertText(t("submissionSuccessful"));
    } catch (error: any) {
      setAlertType(AlertType.error);
      setAlertText(error.message);
    } finally {
      setShowAlert(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={spacing}>
        {title()}
        {description()}
        {ratingField()}
        {feedbackCategoryField()}
        {thoughtsSuggestionsField()}
        {uploadFileField()}
        {submitButton()}
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
