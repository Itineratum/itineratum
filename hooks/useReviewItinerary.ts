import { ReviewItineraryContext } from "@/contexts/reviewItineraryContext";
import { useContext } from "react";

export const useReviewItinerary = () => {
  const context = useContext(ReviewItineraryContext);

  if (!context) {
    throw new Error(
      "useReviewItinerary must be used within an ReviewitineraryProvider"
    );
  }

  return context;
};
