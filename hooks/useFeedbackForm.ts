import { FeedbackFormContext } from "@/contexts/feedbackFormContext";
import { useContext } from "react";

export const useFeedbackForm = () => {
  const context = useContext(FeedbackFormContext);

  if (!context) {
    throw new Error(
      "useFeedbackForm must be used within an FeedbackFormProvider"
    );
  }

  return context;
};
