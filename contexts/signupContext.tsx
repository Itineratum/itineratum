"use client";

import { trpc } from "@/app/_trpc/client";
import { AlertType } from "@/constants/enums/alertType";
import { SignUpFormData } from "@/constants/types/formData/signUpFormData";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

type SignupContextType = {
  control: Control<SignUpFormData, any>;
  errors: FieldErrors<SignUpFormData>;
  setValue: UseFormSetValue<SignUpFormData>;
  getValues: UseFormGetValues<SignUpFormData>;
  trigger: UseFormTrigger<SignUpFormData>;
  stepNumber: number;
  setStepNumber: Dispatch<SetStateAction<number>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  alertType: AlertType;
  setAlertType: Dispatch<SetStateAction<AlertType>>;
  isSigningUp: boolean;
  setIsSigningUp: Dispatch<SetStateAction<boolean>>;
  isVerifying: boolean;
  setIsVerifying: Dispatch<SetStateAction<boolean>>;
  country: string;
  countryCode: string;
  number: string;
  email: string;
  password: string;
  reEnterPassword: string;
  verificationCode: string;
  generateVerificationCode: any;
  verifyVerificationCode: any;
};

export const SignupContext = createContext<SignupContextType | undefined>(
  undefined
);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm<SignUpFormData>();

  const [stepNumber, setStepNumber] = useState<number>(1);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const countryId = "country";
  const countryCodeId = "countryCode";
  const numberId = "number";
  const emailId = "email";
  const passwordId = "password";
  const reEnterPasswordId = "reEnterPassword";
  const verificationCodeId = "verificationCode";

  const country = watch(countryId);
  const countryCode = watch(countryCodeId);
  const number = watch(numberId);
  const email = watch(emailId);
  const password = watch(passwordId);
  const reEnterPassword = watch(reEnterPasswordId);
  const verificationCode = watch(verificationCodeId);

  const t = useTranslations("signUp.signUpForm");

  const generateVerificationCode =
    trpc.user.generateVerificationCode.useMutation({
      onSuccess: () => {
        setStepNumber(3);
        setAlertType(AlertType.info);
        setAlertText(t("emailVerification.codeSentToEmail"));
        setShowAlert(true);
        setIsSigningUp(false);
      },
    });

  const verifyVerificationCode = trpc.user.verifyVerificationCode.useMutation({
    onSuccess: async () => {
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes && signInRes.ok) {
        setAlertText("");
        setShowAlert(false);
        const searchParams = new URLSearchParams(window.location.search);
        const returnUrl = searchParams.get("returnUrl");

        if (returnUrl) {
          // if the user was earlier told to log in to save the generated itinerary, redirect them back to the itinerary page
          router.push(returnUrl);
        } else {
          router.push("/");
        }
      } else {
        setAlertText(t("signUpErrorAlert"));
        setAlertType(AlertType.error);
        setShowAlert(true);
      }
      setIsSigningUp(false);
      setIsVerifying(false);
    },
  });

  return (
    <SignupContext.Provider
      value={{
        control,
        errors,
        setValue,
        getValues,
        trigger,
        stepNumber,
        setStepNumber,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        alertType,
        setAlertType,
        isSigningUp,
        setIsSigningUp,
        isVerifying,
        setIsVerifying,
        country,
        countryCode,
        number,
        email,
        password,
        reEnterPassword,
        verificationCode,
        generateVerificationCode,
        verifyVerificationCode,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};
