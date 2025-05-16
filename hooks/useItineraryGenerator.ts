import { ItineraryGeneratorContext } from "@/contexts/itineraryGeneratorContext";
import { useContext } from "react";

export const useItineraryGenerator = () => {
  const context = useContext(ItineraryGeneratorContext);

  if (!context) {
    throw new Error(
      "useItineraryGenerator must be used within an ItineraryGeneratorProvider"
    );
  }

  return context;
};
