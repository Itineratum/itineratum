"use client";

import { UserRequestedDestination } from "@/constants/types/formData/generateItineraryFormData";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { useWatch } from "react-hook-form";

type Step1ContextType = {
  destinations: UserRequestedDestination[];
  currentDestination: string;
  setCurrentDestination: Dispatch<SetStateAction<string>>;
  dateError: boolean;
  setDateError: Dispatch<SetStateAction<boolean>>;
};

export const Step1Context = createContext<Step1ContextType | undefined>(
  undefined,
);

export const Step1Provider = ({ children }: { children: ReactNode }) => {
  const { fields } = useItineraryGenerator();

  // watch form value changes for real-time updates
  const destinations = useWatch({
    control: fields.control,
    name: "userRequestedDestinations",
    defaultValue: [],
  });
  const [currentDestination, setCurrentDestination] = useState<string>("");
  const [dateError, setDateError] = useState<boolean>(false);

  return (
    <Step1Context.Provider
      value={{
        destinations,
        currentDestination,
        setCurrentDestination,
        dateError,
        setDateError,
      }}
    >
      {children}
    </Step1Context.Provider>
  );
};
