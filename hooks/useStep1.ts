import { Step1Context } from "@/contexts/step1Context";
import { useContext } from "react";

export const useStep1 = () => {
  const context = useContext(Step1Context);

  if (!context) {
    throw new Error("useStep1 must be used within an Step1Provider");
  }

  return context;
};
