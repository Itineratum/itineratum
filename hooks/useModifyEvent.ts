import { ModifyEventContext } from "@/contexts/modifyEventContext";
import { useContext } from "react";

export const useModifyEvent = () => {
  const context = useContext(ModifyEventContext);

  if (!context) {
    throw new Error(
      "useModifyEvent must be used within an ModifyEventProvider"
    );
  }

  return context;
};
