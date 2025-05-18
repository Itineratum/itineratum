import { ItineraryContext } from "@/contexts/itineraryContext";
import { useContext } from "react";

export const useItinerary = () => {
  const context = useContext(ItineraryContext);

  if (!context) {
    throw new Error("useItinerary must be used within an itineraryProvider");
  }

  return context;
};
