import { Step5Context } from "@/contexts/step5Context";
import { useContext } from "react";

export const useStep5 = () => {
  const context = useContext(Step5Context);

  if (!context) {
    throw new Error("useStep5 must be used within an Step5Provider");
  }

  return context;
};
