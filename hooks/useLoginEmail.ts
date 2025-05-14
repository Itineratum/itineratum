import { LoginEmailContext } from "@/contexts/loginEmailContext";
import { useContext } from "react";

export const useLoginEmail = () => {
  const context = useContext(LoginEmailContext);

  if (!context) {
    throw new Error("useLoginEmail must be used within an LoginEmailProvider");
  }

  return context;
};
