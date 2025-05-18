import { SaveItineraryContext } from "@/contexts/saveItineraryContext";
import { useContext } from "react";

export const useSaveItinerary = () => {
  const context = useContext(SaveItineraryContext);

  if (!context) {
    throw new Error(
      "useSaveItinerary must be used within an SaveItineraryProvider"
    );
  }

  return context;
};
