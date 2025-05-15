"use client";

import { trpc } from "@/app/_trpc/client";
import {
  CalendarEvent,
  defaultCalendarEvent,
} from "@/constants/types/calendarEvent";
import { AddCalendarEventFormData } from "@/constants/types/formData/addCalendarEventFormData";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import dayjs, { Dayjs } from "dayjs";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Control, FieldErrors, useForm, UseFormTrigger } from "react-hook-form";

type UserCalendarEventContextType = {
  control: Control<AddCalendarEventFormData, any>;
  errors: FieldErrors<AddCalendarEventFormData>;
  trigger: UseFormTrigger<AddCalendarEventFormData>;
  modifyMode: boolean;
  setModifyMode: Dispatch<SetStateAction<boolean>>;
  isModifying: boolean;
  setIsModifying: Dispatch<SetStateAction<boolean>>;
  isDeleting: boolean;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  previousCalendarEvent: CalendarEvent;
  setPreviousCalendarEvent: Dispatch<SetStateAction<CalendarEvent>>;
  hasModifications: boolean;
  setHasModifications: Dispatch<SetStateAction<boolean>>;
  name: string;
  startDate: any;
  endDate: any;
  modifyUserCalendarEvent: any;
  deleteUserCalendarEvent: any;
  handleOnClose: () => void;
  utils: any;
};

export const UserCalendarEventContext = createContext<
  UserCalendarEventContextType | undefined
>(undefined);

export const UserCalendarEventProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { selectedUserCalendarEvent, setUserCalendarEventDialogOpen } =
    useSavedTrips();
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    reset,
    setValue,
  } = useForm<AddCalendarEventFormData>();

  const [modifyMode, setModifyMode] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [previousCalendarEvent, setPreviousCalendarEvent] =
    useState<CalendarEvent>(
      selectedUserCalendarEvent
        ? selectedUserCalendarEvent
        : defaultCalendarEvent,
    );
  const [hasModifications, setHasModifications] = useState<boolean>(false);

  const nameId = "name";
  const startDateId = "startDate";
  const endDateId = "endDate";
  const name = watch(nameId);
  const startDate = watch(startDateId);
  const endDate = watch(endDateId);

  const modifyUserCalendarEvent =
    trpc.user.modifyUserCalendarEvent.useMutation();
  const deleteUserCalendarEvent =
    trpc.user.deleteUserCalendarEvent.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (selectedUserCalendarEvent) {
      setPreviousCalendarEvent(selectedUserCalendarEvent);
      setValue("name", selectedUserCalendarEvent.title);
      setValue("startDate", dayjs(selectedUserCalendarEvent.start));
      setValue("endDate", dayjs(selectedUserCalendarEvent.end));
    }
  }, [selectedUserCalendarEvent]);

  useEffect(() => {
    if (previousCalendarEvent) {
      setHasModifications(
        name !== previousCalendarEvent.title ||
          !startDate.isSame(dayjs(previousCalendarEvent.start)) ||
          !endDate.isSame(dayjs(previousCalendarEvent.end)),
      );
    }
  }, [name, startDate, endDate, previousCalendarEvent]);

  const handleOnClose = () => {
    setUserCalendarEventDialogOpen(false);
    setHasModifications(false);
    setModifyMode(false);
    setShowAlert(false);
    reset({
      name: "",
      startDate: null as unknown as Dayjs,
      endDate: null as unknown as Dayjs,
    });
  };

  return (
    <UserCalendarEventContext.Provider
      value={{
        control,
        errors,
        trigger,
        modifyMode,
        setModifyMode,
        isModifying,
        setIsModifying,
        isDeleting,
        setIsDeleting,
        showAlert,
        setShowAlert,
        previousCalendarEvent,
        setPreviousCalendarEvent,
        hasModifications,
        setHasModifications,
        name,
        startDate,
        endDate,
        modifyUserCalendarEvent,
        deleteUserCalendarEvent,
        handleOnClose,
        utils,
      }}
    >
      {children}
    </UserCalendarEventContext.Provider>
  );
};
