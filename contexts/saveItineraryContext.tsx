"use client";

import { createContext, ReactNode } from "react";

type SaveItineraryContextType = {};

export const SaveItineraryContext = createContext<
  SaveItineraryContextType | undefined
>(undefined);

export const SaveItineraryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <SaveItineraryContext.Provider value={{}}>
      {children}
    </SaveItineraryContext.Provider>
  );
};
