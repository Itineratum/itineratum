import { AddToDoContext } from "@/contexts/addToDoContext";
import { useContext } from "react";

export const useAddToDo = () => {
  const context = useContext(AddToDoContext);

  if (!context) {
    throw new Error("useAddToDo must be used within an AddToDoProvider");
  }

  return context;
};
