"use client";

import { AlertType } from "@/constants/enums/alertType";
import { ModifyEventFormData } from "@/constants/types/formData/modifyEventFormData";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { EventTimeOfDay } from "@/lib/pythonBackend/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Control,
  FieldErrors,
  useForm,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

type ModifyEventContextType = {
  control: Control<ModifyEventFormData, any>;
  errors: FieldErrors<ModifyEventFormData>;
  setValue: UseFormSetValue<ModifyEventFormData>;
  trigger: UseFormTrigger<ModifyEventFormData>;
  modifyingActivity: boolean;
  setModifyingActivity: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  alertType: AlertType;
  setAlertType: Dispatch<SetStateAction<AlertType>>;
  hasModifications: boolean;
  setHasModifications: Dispatch<SetStateAction<boolean>>;
  locationName: string;
  locationCity: string;
  timeOfDay: EventTimeOfDay;
  handleOnClose: () => void;
};

export const ModifyEventContext = createContext<
  ModifyEventContextType | undefined
>(undefined);

export const ModifyEventProvider = ({ children }: { children: ReactNode }) => {
  const { setModifyEventDialogOpen, events, indexToModifyEventAt, dayPlan } =
    useReviewItinerary();

  const event = events[indexToModifyEventAt ?? 0];

  const {
    control,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<ModifyEventFormData>();

  const [modifyingActivity, setModifyingActivity] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [hasModifications, setHasModifications] = useState<boolean>(false);

  const locationNameId = "locationName";
  const locationCityId = "locationCity";
  const timeOfDayId = "timeOfDay";
  const locationName = watch(locationNameId);
  const locationCity = watch(locationCityId);
  const timeOfDay = watch(timeOfDayId);

  useEffect(() => {
    if (event && dayPlan) {
      setValue(locationNameId, event.event_name);
      setValue(locationCityId, dayPlan.destination);
      setValue(timeOfDayId, event.time_of_day);
    }
  }, [event, dayPlan]);

  useEffect(() => {
    if (event && dayPlan) {
      setHasModifications(
        locationName !== event.event_name ||
          locationCity !== dayPlan.destination ||
          timeOfDay !== event.time_of_day,
      );
    }
  }, [locationName, locationCity, timeOfDay, event, dayPlan]);

  const handleOnClose = () => {
    if (!modifyingActivity) {
      setShowAlert(false);
      setModifyEventDialogOpen(false);
    }
  };

  return (
    <ModifyEventContext.Provider
      value={{
        control,
        errors,
        setValue,
        trigger,
        modifyingActivity,
        setModifyingActivity,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        alertType,
        setAlertType,
        hasModifications,
        setHasModifications,
        locationName,
        locationCity,
        timeOfDay,
        handleOnClose,
      }}
    >
      {children}
    </ModifyEventContext.Provider>
  );
};
