import { AdjustBudgetDialogContext } from "@/contexts/adjustBudgetDialogContext";
import { useContext } from "react";

export const useAdjustBudgetDialog = () => {
  const context = useContext(AdjustBudgetDialogContext);

  if (!context) {
    throw new Error(
      "useAdjustBudgetDialog must be used within an AdjustBudgetDialogProvider"
    );
  }

  return context;
};
