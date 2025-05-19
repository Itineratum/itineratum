import { AddEventContext } from "@/contexts/addEventContext";
import { useContext } from "react";

export const useAddEvent = () => {
  const context = useContext(AddEventContext);

  if (!context) {
    throw new Error("useAddEvent must be used within an AddEventProvider");
  }

  return context;
};
