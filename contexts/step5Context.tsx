"use client";

import { UserRequestedDestination } from "@/constants/types/formData/generateItineraryFormData";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type Step5ContextType = {
  totalDays: number;
  setTotalDays: Dispatch<SetStateAction<number>>;
  daysAllocated: {
    [key: string]: number;
  };
  setDaysAllocated: Dispatch<
    SetStateAction<{
      [key: string]: number;
    }>
  >;
};

export const Step5Context = createContext<Step5ContextType | undefined>(
  undefined
);

export const Step5Provider = ({ children }: { children: ReactNode }) => {
  const { fields } = useItineraryGenerator();

  const [totalDays, setTotalDays] = useState<number>(() => {
    const startDate = fields.getValues("startDate");
    const endDate = fields.getValues("endDate");
    return endDate.diff(startDate, "day") + 1;
  });
  const [daysAllocated, setDaysAllocated] = useState<{
    [key: string]: number;
  }>(() => {
    const destinations = fields.getValues("userRequestedDestinations");
    const initialAllocation: { [key: string]: number } = {};
    destinations.forEach((destination: UserRequestedDestination) => {
      initialAllocation[destination.name] = 0;
    });
    return initialAllocation;
  });

  useEffect(() => {
    // synchronize daysAllocated state with form values on initial load
    const initialDaysAllocated: { [key: string]: number } = {};
    const destinations = fields.getValues("userRequestedDestinations");
    destinations.forEach((destination: UserRequestedDestination) => {
      const destinationStartDate = destination.startDate;
      const destinationEndDate = destination.endDate;
      initialDaysAllocated[destination.name] =
        destinationEndDate.diff(destinationStartDate, "day") + 1;
    });
    setDaysAllocated(initialDaysAllocated);
  }, [fields.watch("userRequestedDestinations")]);

  return (
    <Step5Context.Provider
      value={{ totalDays, setTotalDays, daysAllocated, setDaysAllocated }}
    >
      {children}
    </Step5Context.Provider>
  );
};
