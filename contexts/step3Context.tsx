"use client";

import {
  defaultFocusRankings,
  GenerateItineraryFocus,
} from "@/constants/enums/generateItinerary";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type Step3ContextType = {
  focusRankings: {
    [key in GenerateItineraryFocus]: number;
  };
  setFocusRankings: Dispatch<
    SetStateAction<{
      [key in GenerateItineraryFocus]: number;
    }>
  >;
  getFocusKey: (focus: GenerateItineraryFocus) => string;
};

export const Step3Context = createContext<Step3ContextType | undefined>(
  undefined
);

export const Step3Provider = ({ children }: { children: ReactNode }) => {
  const { fields } = useItineraryGenerator();

  const [focusRankings, setFocusRankings] = useState<{
    [key in GenerateItineraryFocus]: number;
  }>(defaultFocusRankings);

  const getFocusKey = (focus: GenerateItineraryFocus) => {
    return Object.entries(GenerateItineraryFocus).filter(
      (entry) => entry[1] === focus
    )[0][0];
  };

  useEffect(() => {
    // synchronize focusRankings state with form values on initial load
    const initialFocusRankings = {
      [GenerateItineraryFocus.attraction]:
        fields.getValues("focus.attraction") || 0,
      [GenerateItineraryFocus.localCuisine]:
        fields.getValues("focus.localCuisine") || 0,
      [GenerateItineraryFocus.nature]: fields.getValues("focus.nature") || 0,
      [GenerateItineraryFocus.shopping]:
        fields.getValues("focus.shopping") || 0,
    };
    setFocusRankings(initialFocusRankings);
  }, [fields]);

  return (
    <Step3Context.Provider
      value={{
        focusRankings,
        setFocusRankings,
        getFocusKey,
      }}
    >
      {children}
    </Step3Context.Provider>
  );
};
