"use client";

import { trpc } from "@/app/_trpc/client";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { AlertType } from "@/constants/enums/alertType";
import {
  FeedbackCategory,
  FeedbackFormData,
} from "@/constants/types/formData/feedbackFormData";
import { generateReactHelpers } from "@uploadthing/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import {
  Control,
  useForm,
  UseFormHandleSubmit,
  UseFormReset,
} from "react-hook-form";

type FeedbackFormContextType = {
  email: string | null | undefined;
  name: string | null | undefined;
  control: Control<FeedbackFormData, any>;
  reset: UseFormReset<FeedbackFormData>;
  rating: number;
  feedbackCategory: FeedbackCategory;
  thoughtsSuggestions: string;
  files: File[];
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  alertType: AlertType;
  setAlertType: Dispatch<SetStateAction<AlertType>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<FeedbackFormData, undefined>;
  onSubmit: any;
};

export const FeedbackFormContext = createContext<
  FeedbackFormContextType | undefined
>(undefined);

export const FeedbackFormProvider = ({ children }: { children: ReactNode }) => {
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

  const t = useTranslations("contactUs.feedbackForm");

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
        feedbackNotificationEmailData
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
    <FeedbackFormContext.Provider
      value={{
        email,
        name,
        control,
        reset,
        rating,
        feedbackCategory,
        thoughtsSuggestions,
        files,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        alertType,
        setAlertType,
        isSubmitting,
        setIsSubmitting,
        handleSubmit,
        onSubmit,
      }}
    >
      {children}
    </FeedbackFormContext.Provider>
  );
};
