import { Step3Context } from "@/contexts/step3Context";
import { useContext } from "react";

export const useStep3 = () => {
  const context = useContext(Step3Context);

  if (!context) {
    throw new Error("useStep3 must be used within an Step3Provider");
  }

  return context;
};
