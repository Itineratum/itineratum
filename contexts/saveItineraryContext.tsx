"use client";

import { trpc } from "@/app/_trpc/client";
import { SaveItineraryFormData } from "@/constants/types/formData/saveItineraryFormData";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Control, FieldErrors, useForm, UseFormTrigger } from "react-hook-form";

type SaveItineraryContextType = {
  control: Control<SaveItineraryFormData, any>;
  errors: FieldErrors<SaveItineraryFormData>;
  trigger: UseFormTrigger<SaveItineraryFormData>;
  isSendingEmail: boolean;
  setIsSendingEmail: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  email: string;
  emailItinerary: any;
};

export const SaveItineraryContext = createContext<
  SaveItineraryContextType | undefined
>(undefined);

export const SaveItineraryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    control,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SaveItineraryFormData>();

  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const emailId = "email";
  const email = watch(emailId);

  const emailItinerary = trpc.itinerary.emailItinerary.useMutation();

  return (
    <SaveItineraryContext.Provider
      value={{
        control,
        errors,
        trigger,
        isSendingEmail,
        setIsSendingEmail,
        showAlert,
        setShowAlert,
        email,
        emailItinerary,
      }}
    >
      {children}
    </SaveItineraryContext.Provider>
  );
};
