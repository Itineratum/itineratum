"use client";

import { trpc } from "@/app/_trpc/client";
import { Currency } from "@/constants/enums/currency";
import { GenerateItineraryStep } from "@/constants/enums/generateItinerary";
import { AdjustBudgetFormData } from "@/constants/types/formData/adjustBudgetFormData";
import { useItinerary } from "@/hooks/useItinerary";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { GenerateItineraryJSON } from "@/lib/pythonBackend/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { useForm, UseFormReturn } from "react-hook-form";

type AdjustBudgetDialogContextType = {
  fields: UseFormReturn<AdjustBudgetFormData, any, undefined>;
  adjustingBudget: boolean;
  setAdjustingBudget: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  generationStep: GenerateItineraryStep;
  setGenerationStep: Dispatch<SetStateAction<GenerateItineraryStep>>;
  budget: number;
  adjustItineraryBudget: any;
  utils: any;
  currency: Currency;
  itineraryRequest: GenerateItineraryJSON | undefined;
  itineraryId: string;
};

export const AdjustBudgetDialogContext = createContext<
  AdjustBudgetDialogContextType | undefined
>(undefined);

export const AdjustBudgetDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { itineraryData } = useReviewItinerary();
  const { params } = useItinerary();

  const itineraryRequest = itineraryData?.request;
  const currency: Currency = itineraryRequest
    ? (itineraryRequest.payload.localisation.currency as Currency)
    : Currency.sgd;
  const currentBudget: number = itineraryRequest
    ? itineraryRequest.payload.budget
    : 0;
  const itineraryId = params.id;

  const fields = useForm<AdjustBudgetFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      budget: currentBudget,
    },
  });

  const [adjustingBudget, setAdjustingBudget] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [generationStep, setGenerationStep] = useState<GenerateItineraryStep>(
    GenerateItineraryStep.inputting,
  );

  const budgetId = "budget";
  const budget = fields.watch(budgetId);

  const adjustItineraryBudget =
    trpc.itinerary.adjustItineraryBudget.useMutation();
  const utils = trpc.useUtils();

  return (
    <AdjustBudgetDialogContext.Provider
      value={{
        fields,
        adjustingBudget,
        setAdjustingBudget,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        generationStep,
        setGenerationStep,
        budget,
        adjustItineraryBudget,
        utils,
        currency,
        itineraryRequest,
        itineraryId,
      }}
    >
      {children}
    </AdjustBudgetDialogContext.Provider>
  );
};
