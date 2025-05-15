"use client";

import { trpc } from "@/app/_trpc/client";
import { AddCalendarEventFormData } from "@/constants/types/formData/addCalendarEventFormData";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { Dayjs } from "dayjs";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import {
  Control,
  FieldErrors,
  useForm,
  UseFormReset,
  UseFormTrigger,
} from "react-hook-form";

type AddCalendarEventContextType = {
  session: Session | null;
  control: Control<AddCalendarEventFormData, any>;
  errors: FieldErrors<AddCalendarEventFormData>;
  trigger: UseFormTrigger<AddCalendarEventFormData>;
  reset: UseFormReset<AddCalendarEventFormData>;
  isAddingCalendarEvent: boolean;
  setIsAddingCalendarEvent: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  addUserCalendarEvent: any;
  utils: any;
  handleOnClose: () => void;
};

export const AddCalendarEventContext = createContext<
  AddCalendarEventContextType | undefined
>(undefined);

export const AddCalendarEventProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<AddCalendarEventFormData>();
  const { setShowAddCalendarEventDialog } = useSavedTrips();

  const [isAddingCalendarEvent, setIsAddingCalendarEvent] =
    useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const nameId = "name";
  const startDateId = "startDate";
  const endDateId = "endDate";
  const name = watch(nameId);
  const startDate = watch(startDateId);
  const endDate = watch(endDateId);

  const addUserCalendarEvent = trpc.user.addUserCalendarEvent.useMutation();
  const utils = trpc.useUtils();

  const handleOnClose = () => {
    if (!isAddingCalendarEvent) {
      setShowAddCalendarEventDialog(false);
      setShowAlert(false);
      reset({
        name: "",
        startDate: null as unknown as Dayjs,
        endDate: null as unknown as Dayjs,
      });
    }
  };

  return (
    <AddCalendarEventContext.Provider
      value={{
        session,
        control,
        errors,
        trigger,
        reset,
        isAddingCalendarEvent,
        setIsAddingCalendarEvent,
        showAlert,
        setShowAlert,
        name,
        startDate,
        endDate,
        addUserCalendarEvent,
        utils,
        handleOnClose,
      }}
    >
      {children}
    </AddCalendarEventContext.Provider>
  );
};
