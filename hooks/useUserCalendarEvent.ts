import { UserCalendarEventContext } from "@/contexts/userCalendarEventContext";
import { useContext } from "react";

export const useUserCalendarEvent = () => {
  const context = useContext(UserCalendarEventContext);

  if (!context) {
    throw new Error(
      "useUserCalendarEvent must be used within an UserCalendarEventProvider"
    );
  }

  return context;
};
