"use client";

import { trpc } from "@/app/_trpc/client";
import { AlertType } from "@/constants/enums/alertType";
import { useAccount } from "@/hooks/useAccount";
import { useTranslations } from "next-intl";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type NotificationsContextType = {
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  alertType: AlertType;
  setAlertType: Dispatch<SetStateAction<AlertType>>;
  newsletterEmail: boolean;
  setNewsletterEmail: Dispatch<SetStateAction<boolean>>;
  newsletterPushNotifications: boolean;
  setNewsletterPushNotifications: Dispatch<SetStateAction<boolean>>;
  allOffersUpdatesEmail: boolean;
  setAllOffersUpdatesEmail: Dispatch<SetStateAction<boolean>>;
  allOffersUpdatesPushNotifications: boolean;
  setAllOffersUpdatesPushNotifications: Dispatch<SetStateAction<boolean>>;
  getUserNotificationsSettings: any;
  updateUserNotificationsSetting: any;
};

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { session, router } = useAccount();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [newsletterEmail, setNewsletterEmail] = useState<boolean>(false);
  const [newsletterPushNotifications, setNewsletterPushNotifications] =
    useState<boolean>(false);
  const [allOffersUpdatesEmail, setAllOffersUpdatesEmail] =
    useState<boolean>(false);
  const [
    allOffersUpdatesPushNotifications,
    setAllOffersUpdatesPushNotifications,
  ] = useState<boolean>(false);

  const t = useTranslations("account.notifications");

  const getUserNotificationsSettings =
    trpc.user.getUserNotificationsSettings.useQuery(
      {
        email: session?.user.email!,
      },
      {
        onError: (error) => {
          if (error.message === "UNAUTHORIZED") router.push("/protected");
        },
      }
    );

  const updateUserNotificationsSetting =
    trpc.user.updateUserNotificationsSettings.useMutation({
      onSuccess: () => {
        setAlertType(AlertType.success);
        setAlertText(t("notificationsUpdated"));
        setShowAlert(true);
      },
      onError: (error) => {
        if (error.message === "UNAUTHORIZED") router.push("/protected");
      },
    });

  return (
    <NotificationsContext.Provider
      value={{
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        alertType,
        setAlertType,
        newsletterEmail,
        setNewsletterEmail,
        newsletterPushNotifications,
        setNewsletterPushNotifications,
        allOffersUpdatesEmail,
        setAllOffersUpdatesEmail,
        allOffersUpdatesPushNotifications,
        setAllOffersUpdatesPushNotifications,
        getUserNotificationsSettings,
        updateUserNotificationsSetting,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
