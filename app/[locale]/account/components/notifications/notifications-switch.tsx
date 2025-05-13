import {
  AccountNotificationsField,
  AccountNotificationsFieldType,
} from "@/constants/enums/accountNotifications";
import { AlertType } from "@/constants/enums/alertType";
import { useAccount } from "@/hooks/useAccount";
import { useNotifications } from "@/hooks/useNotifications";
import { Switch } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const NotificationsSwitch = ({
  field,
  fieldType,
  value,
}: {
  field: AccountNotificationsField;
  fieldType: AccountNotificationsFieldType;
  value: boolean;
}) => {
  const { session } = useAccount();
  const {
    setNewsletterEmail,
    setNewsletterPushNotifications,
    setAllOffersUpdatesEmail,
    setAllOffersUpdatesPushNotifications,
    setAlertType,
    setAlertText,
    setShowAlert,
    updateUserNotificationsSetting,
  } = useNotifications();

  const [checked, setChecked] = useState<boolean>(value);

  const t = useTranslations("account.notifications");

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setChecked(newValue);

    // add a timeout so that the animation can be played before the state changes and trpc call kicks in
    setTimeout(async () => {
      if (field === AccountNotificationsField.newsletter) {
        if (fieldType === AccountNotificationsFieldType.email) {
          setNewsletterEmail(newValue);
        } else {
          setNewsletterPushNotifications(newValue);
        }
      } else {
        if (fieldType === AccountNotificationsFieldType.email) {
          setAllOffersUpdatesEmail(newValue);
        } else {
          setAllOffersUpdatesPushNotifications(newValue);
        }
      }

      const data = {
        email: session?.user.email!,
        name: session?.user.name!,
        field,
        fieldType,
        value: newValue,
      };

      try {
        await updateUserNotificationsSetting.mutateAsync(data);
      } catch (error) {
        if (error instanceof TRPCClientError) {
          setAlertType(AlertType.error);
          setAlertText(t("notificationsUpdateError"));
          setShowAlert(true);
        }
      }
    }, 100);
  };

  return <Switch onChange={handleOnChange} checked={checked} />;
};

export default NotificationsSwitch;
