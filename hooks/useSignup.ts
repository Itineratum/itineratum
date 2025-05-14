import { SignupContext } from "@/contexts/signupContext";
import { useContext } from "react";

export const useSignup = () => {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error("useSignup must be used within an SignupProvider");
  }

  return context;
};
