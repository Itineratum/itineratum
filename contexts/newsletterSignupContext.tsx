"use client";

import { trpc } from "@/app/_trpc/client";
import { AlertType } from "@/constants/enums/alertType";
import { NewsletterFormData } from "@/constants/types/formData/newsletterFormData";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Control, FieldErrors, useForm, UseFormTrigger } from "react-hook-form";
import { useInView } from "react-intersection-observer";

type NewsletterSignupContextType = {
  errors: FieldErrors<NewsletterFormData>;
  trigger: UseFormTrigger<NewsletterFormData>;
  control: Control<NewsletterFormData, any>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  alertType: AlertType;
  setAlertType: Dispatch<SetStateAction<AlertType>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  hasEmailInNewsletter: boolean;
  setHasEmailInNewsletter: Dispatch<SetStateAction<boolean>>;
  name: string;
  email: string;
  addEmailToNewsLetter: any;
  checkEmailInNewsletter: any;
  ref: any;
  inView: any;
  isLoggedIn: boolean;
};

export const NewsletterSignupContext = createContext<
  NewsletterSignupContextType | undefined
>(undefined);

export const NewsletterSignupProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const {
    formState: { errors },
    watch,
    trigger,
    control,
  } = useForm<NewsletterFormData>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasEmailInNewsletter, setHasEmailInNewsletter] =
    useState<boolean>(isLoggedIn);

  const nameId = "name";
  const emailId = "email";
  const name = watch(nameId);
  const email = watch(emailId);

  const t = useTranslations("home.newsletterSignup");

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const addEmailToNewsLetter =
    trpc.newsletterEmail.addEmailToNewsletter.useMutation({
      onSuccess: (response) => {
        setAlertType(response ? AlertType.success : AlertType.error);
        setAlertText(response ? t("emailSuccess") : t("emailExists"));
        setShowAlert(true);
        setIsSubmitting(false);

        if (isLoggedIn) setHasEmailInNewsletter(true);
      },
    });
  const checkEmailInNewsletter =
    trpc.newsletterEmail.checkEmailInNewsletter.useQuery(
      { email: session?.user.email! },
      { retry: false, enabled: isLoggedIn },
    );

  useEffect(() => {
    if (checkEmailInNewsletter.isFetched) {
      setHasEmailInNewsletter(checkEmailInNewsletter.data ?? false);
    }
  }, [checkEmailInNewsletter.isFetched]);

  return (
    <NewsletterSignupContext.Provider
      value={{
        errors,
        trigger,
        control,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        alertType,
        setAlertType,
        isSubmitting,
        setIsSubmitting,
        hasEmailInNewsletter,
        setHasEmailInNewsletter,
        name,
        email,
        addEmailToNewsLetter,
        checkEmailInNewsletter,
        ref,
        inView,
        isLoggedIn,
      }}
    >
      {children}
    </NewsletterSignupContext.Provider>
  );
};
