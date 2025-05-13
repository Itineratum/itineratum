"use client";

import { trpc } from "@/app/_trpc/client";
import { AlertType } from "@/constants/enums/alertType";
import { AccountPersonalInformationFormData } from "@/constants/types/formData/accountPersonalInformationData";
import { useAccount } from "@/hooks/useAccount";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { signOut } from "next-auth/react";
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
} from "react-hook-form";
dayjs.extend(utc);

type PersonalInformationContextType = {
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  alertType: AlertType;
  setAlertType: Dispatch<SetStateAction<AlertType>>;
  isUpdating: boolean;
  setIsUpdating: Dispatch<SetStateAction<boolean>>;
  showConfirmDeleteDialog: boolean;
  setShowConfirmDeleteDialog: Dispatch<SetStateAction<boolean>>;
  isChangePassword: boolean;
  setIsChangePassword: Dispatch<SetStateAction<boolean>>;
  getUserAccountDetails: any;
  deleteUserAccount: any;
  updateUserAccount: any;
  control: Control<AccountPersonalInformationFormData, any>;
  errors: FieldErrors<AccountPersonalInformationFormData>;
  setValue: UseFormSetValue<AccountPersonalInformationFormData>;
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  dateOfBirth: Dayjs | null;
  closeConfirmDeleteDialog: () => void;
  deleteAccount: () => Promise<void>;
};

export const PersonalInformationContext = createContext<
  PersonalInformationContextType | undefined
>(undefined);

export const PersonalInformationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { session, isLoggedIn, router, update } = useAccount();
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AccountPersonalInformationFormData>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] =
    useState<boolean>(false);
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);

  const firstNameId = "firstName";
  const lastNameId = "lastName";
  const emailId = "email";
  const address1Id = "address1";
  const address2Id = "address2";
  const dateOfBirthId = "dateOfBirth";

  const firstName = watch(firstNameId);
  const lastName = watch(lastNameId);
  const email = watch(emailId);
  const address1 = watch(address1Id);
  const address2 = watch(address2Id);
  const dateOfBirth = watch(dateOfBirthId);

  const getUserAccountDetails = trpc.user.getUserAccountDetails.useQuery(
    {
      email: session?.user.email!,
    },
    {
      retry: false,
      enabled: isLoggedIn,
      onError: (error) => {
        if (error.message === "UNAUTHORIZED") router.push("/protected");
      },
    },
  );

  const deleteUserAccount = trpc.user.deleteUserAccount.useMutation({
    onError: (error) => {
      if (error.message === "UNAUTHORIZED") router.push("/protected");
    },
  });

  const updateUserAccount = trpc.user.updateUserAccount.useMutation({
    onSuccess: () => {
      // update the session
      update({ name: firstName });
    },
    onError: (error) => {
      if (error.message === "UNAUTHORIZED") router.push("/protected");
    },
  });

  const closeConfirmDeleteDialog = () => {
    setShowConfirmDeleteDialog(false);
  };

  const deleteAccount = async () => {
    const name = session?.user.name;
    const data = { email, name };
    await deleteUserAccount.mutateAsync(data);
    signOut({ callbackUrl: "/" });
  };

  return (
    <PersonalInformationContext.Provider
      value={{
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        alertType,
        setAlertType,
        isUpdating,
        setIsUpdating,
        showConfirmDeleteDialog,
        setShowConfirmDeleteDialog,
        isChangePassword,
        setIsChangePassword,
        getUserAccountDetails,
        deleteUserAccount,
        updateUserAccount,
        control,
        errors,
        setValue,
        firstName,
        lastName,
        email,
        address1,
        address2,
        dateOfBirth,
        closeConfirmDeleteDialog,
        deleteAccount,
      }}
    >
      {children}
    </PersonalInformationContext.Provider>
  );
};
