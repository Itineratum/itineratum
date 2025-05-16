import { Step2Context } from "@/contexts/step2Context";
import { useContext } from "react";

export const useStep2 = () => {
  const context = useContext(Step2Context);

  if (!context) {
    throw new Error("useStep2 must be used within an Step2Provider");
  }

  return context;
};
