import { AddCalendarEventContext } from "@/contexts/addCalendarEventContext";
import { useContext } from "react";

export const useAddCalendarEvent = () => {
  const context = useContext(AddCalendarEventContext);

  if (!context) {
    throw new Error(
      "useAddCalendarEvent must be used within an AddCalendarEventProvider"
    );
  }

  return context;
};
