import { PersonalInformationContext } from "@/contexts/personalInformationContext";
import { useContext } from "react";

export const usePersonalInformation = () => {
  const context = useContext(PersonalInformationContext);

  if (!context) {
    throw new Error(
      "usePersonalInformation must be used within an PersonalInformationProvider",
    );
  }

  return context;
};
