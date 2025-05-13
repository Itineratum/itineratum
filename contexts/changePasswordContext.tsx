"use client";

import { trpc } from "@/app/_trpc/client";
import { AlertType } from "@/constants/enums/alertType";
import { ChangePasswordFormData } from "@/constants/types/formData/accountPersonalInformationData";
import { useAccount } from "@/hooks/useAccount";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { useTranslations } from "next-intl";
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
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

type ChangePasswordContextType = {
  isChangingPassword: boolean;
  setIsChangingPassword: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  alertType: AlertType;
  setAlertType: Dispatch<SetStateAction<AlertType>>;
  control: Control<ChangePasswordFormData, any>;
  errors: FieldErrors<ChangePasswordFormData>;
  trigger: UseFormTrigger<ChangePasswordFormData>;
  setValue: UseFormSetValue<ChangePasswordFormData>;
  watch: UseFormWatch<ChangePasswordFormData>;
  currentPassword: string;
  newPassword: string;
  reEnterNewPassword: string;
  cancelChangePassword: () => void;
  changeUserPassword: any;
};

export const ChangePasswordContext = createContext<
  ChangePasswordContextType | undefined
>(undefined);

export const ChangePasswordProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    setIsChangePassword,
    setAlertText: setAccountPersonalInformationAlertText,
    setAlertType: setAccountPersonalInformationAlertType,
    setShowAlert: setAccountPersonalInformationShowAlert,
  } = usePersonalInformation();
  const { router } = useAccount();
  const {
    control,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<ChangePasswordFormData>();

  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);

  const currentPasswordId = "currentPassword";
  const newPasswordId = "newPassword";
  const reEnterNewPasswordId = "reEnterNewPassword";

  const currentPassword = watch(currentPasswordId);
  const newPassword = watch(newPasswordId);
  const reEnterNewPassword = watch(reEnterNewPasswordId);

  const t = useTranslations("account.personalInformation.changePassword");

  const cancelChangePassword = () => {
    setValue("currentPassword", "");
    setValue("newPassword", "");
    setValue("reEnterNewPassword", "");
    setIsChangePassword(false); // hide the change password form
  };

  const changeUserPassword = trpc.user.changeUserPassword.useMutation({
    onSuccess: () => {
      cancelChangePassword();
      setAccountPersonalInformationAlertText(t("passwordChangeSuccess"));
      setAccountPersonalInformationAlertType(AlertType.success);
      setAccountPersonalInformationShowAlert(true);
    },
    onError: (error) => {
      if (error.message === "UNAUTHORIZED") router.push("/protected");
    },
  });

  return (
    <ChangePasswordContext.Provider
      value={{
        isChangingPassword,
        setIsChangingPassword,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        alertType,
        setAlertType,
        control,
        errors,
        trigger,
        setValue,
        watch,
        currentPassword,
        newPassword,
        reEnterNewPassword,
        cancelChangePassword,
        changeUserPassword,
      }}
    >
      {children}
    </ChangePasswordContext.Provider>
  );
};
