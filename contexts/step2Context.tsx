"use client";

import { getCurrencySymbol } from "@/constants/enums/currency";
import { getCookie } from "cookies-next";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type Step2ContextType = {
  currency: string | undefined;
  setCurrency: Dispatch<SetStateAction<string | undefined>>;
};

export const Step2Context = createContext<Step2ContextType | undefined>(
  undefined
);

export const Step2Provider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // TODO: to see how to change currency automatically based on the selected currency in the CurrencySwitcher component
    const storedCurrency = getCookie("currency");
    setCurrency(getCurrencySymbol(storedCurrency!));
  }, [getCookie("currency")]);

  const [currency, setCurrency] = useState<string | undefined>("");

  return (
    <Step2Context.Provider
      value={{
        currency,
        setCurrency,
      }}
    >
      {children}
    </Step2Context.Provider>
  );
};
