import { SavedTripsContext } from "@/contexts/savedTripsContext";
import { useContext } from "react";

export const useSavedTrips = () => {
  const context = useContext(SavedTripsContext);

  if (!context) {
    throw new Error("useSavedTrips must be used within an SavedTripsProvider");
  }

  return context;
};
