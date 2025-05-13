import Text from "@/components/atoms/text";
import {
  AccountNotificationsField,
  AccountNotificationsFieldType,
} from "@/constants/enums/accountNotifications";
import { TypographyVariant } from "@/constants/enums/theme";
import { useNotifications } from "@/hooks/useNotifications";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import NotificationsSwitch from "../notifications-switch";
import Status from "../status";
import { ACCOUNT_NOTIFICATIONS_STYLES } from "../styles";

const PushNotificationsField = () => {
  const { newsletterPushNotifications } = useNotifications();

  const t = useTranslations("account.notifications");
  const styles = ACCOUNT_NOTIFICATIONS_STYLES;
  const field = AccountNotificationsField.newsletter;
  const fieldType = AccountNotificationsFieldType.pushNotifications;

  const pushNotificationsLabel = () => {
    return (
      <Stack>
        <Text
          text={t("pushNotifications")}
          variant={TypographyVariant.h6}
          bold={false}
        />
        <Status isEnabled={newsletterPushNotifications} />
      </Stack>
    );
  };

  return (
    <Stack
      direction={"row"}
      justifyContent="space-between"
      width={styles.FIELD_WIDTH}
      alignItems="center"
      spacing={styles.SPACING}
    >
      {pushNotificationsLabel()}
      <NotificationsSwitch
        key={String(newsletterPushNotifications)}
        field={field}
        fieldType={fieldType}
        value={newsletterPushNotifications}
      />
    </Stack>
  );
};

export default PushNotificationsField;
