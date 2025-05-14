import { LoginContext } from "@/contexts/loginContext";
import { useContext } from "react";

export const useLogin = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error("useLogin must be used within an LoginProvider");
  }

  return context;
};
