import { AccountContext } from "@/contexts/accountContext";
import { useContext } from "react";

export const useAccount = () => {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }

  return context;
};
