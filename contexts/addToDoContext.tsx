"use client";

import { trpc } from "@/app/_trpc/client";
import { AddToDoFormData } from "@/constants/types/formData/addToDoFormData";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Control, FieldErrors, useForm, UseFormTrigger } from "react-hook-form";

type AddToDoContextType = {
  session: Session | null;
  control: Control<AddToDoFormData, any>;
  errors: FieldErrors<AddToDoFormData>;
  trigger: UseFormTrigger<AddToDoFormData>;
  isAddingToDo: boolean;
  setIsAddingToDo: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  name: string;
  addToUserToDoList: any;
  utils: any;
  handleOnClose: () => void;
};

export const AddToDoContext = createContext<AddToDoContextType | undefined>(
  undefined,
);

export const AddToDoProvider = ({ children }: { children: ReactNode }) => {
  const { setShowAddToDoDialog } = useSavedTrips();
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<AddToDoFormData>();

  const [isAddingToDo, setIsAddingToDo] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const nameId = "name";
  const name = watch(nameId);

  const addToUserToDoList = trpc.user.addToUserToDoList.useMutation();
  const utils = trpc.useUtils();

  const handleOnClose = () => {
    if (!isAddingToDo) {
      setShowAddToDoDialog(false);
      setShowAlert(false);
      reset({
        name: "",
      });
    }
  };

  return (
    <AddToDoContext.Provider
      value={{
        session,
        control,
        errors,
        trigger,
        isAddingToDo,
        setIsAddingToDo,
        showAlert,
        setShowAlert,
        name,
        addToUserToDoList,
        utils,
        handleOnClose,
      }}
    >
      {children}
    </AddToDoContext.Provider>
  );
};
