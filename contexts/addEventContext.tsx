"use client";

import { AlertType } from "@/constants/enums/alertType";
import { AddNewEventFormData } from "@/constants/types/formData/addNewEventFormData";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { EventTimeOfDay } from "@/lib/pythonBackend/types";
import { Dayjs } from "dayjs";
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
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

type AddEventContextType = {
  control: Control<AddNewEventFormData, any>;
  errors: FieldErrors<AddNewEventFormData>;
  setValue: UseFormSetValue<AddNewEventFormData>;
  trigger: UseFormTrigger<AddNewEventFormData>;
  reset: UseFormReset<AddNewEventFormData>;
  addingActivity: boolean;
  setAddingActivity: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  alertType: AlertType;
  setAlertType: Dispatch<SetStateAction<AlertType>>;
  isHotelEvent: boolean;
  locationName: string;
  locationCity: string;
  timeOfDay: EventTimeOfDay;
  checkInTime: Dayjs | null;
  checkOutTime: Dayjs | null;
  handleOnClose: () => void;
};

export const AddEventContext = createContext<AddEventContextType | undefined>(
  undefined
);

export const AddEventProvider = ({ children }: { children: ReactNode }) => {
  const { setAddEventDialogOpen } = useReviewItinerary();

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<AddNewEventFormData>({
    defaultValues: {
      isHotelEvent: false,
    },
  });

  const [addingActivity, setAddingActivity] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);

  const isHotelEventId = "isHotelEvent";
  const locationNameId = "locationName";
  const locationCityId = "locationCity";
  const timeOfDayId = "timeOfDay";
  const checkInTimeId = "checkInTime";
  const checkOutTimeId = "checkOutTime";
  const isHotelEvent = watch(isHotelEventId);
  const locationName = watch(locationNameId);
  const locationCity = watch(locationCityId);
  const timeOfDay = watch(timeOfDayId);
  const checkInTime = watch(checkInTimeId);
  const checkOutTime = watch(checkOutTimeId);

  const handleOnClose = () => {
    if (!addingActivity) {
      setShowAlert(false);
      setAddEventDialogOpen(false);
      reset({
        isHotelEvent: false,
        locationName: "",
        locationCity: "",
        timeOfDay: null as unknown as EventTimeOfDay,
      });
    }
  };

  return (
    <AddEventContext.Provider
      value={{
        control,
        errors,
        setValue,
        trigger,
        reset,
        addingActivity,
        setAddingActivity,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        alertType,
        setAlertType,
        isHotelEvent,
        locationName,
        locationCity,
        timeOfDay,
        checkInTime,
        checkOutTime,
        handleOnClose,
      }}
    >
      {children}
    </AddEventContext.Provider>
  );
};
