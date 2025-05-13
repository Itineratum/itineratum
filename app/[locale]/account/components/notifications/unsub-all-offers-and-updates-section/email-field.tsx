import { TypographyVariant } from "@/constants/enums/theme";
import { Stack } from "@mui/material";
import NotificationsSwitch from "../notifications-switch";
import Status from "../status";
import { ACCOUNT_NOTIFICATIONS_STYLES } from "../styles";
import { useTranslations } from "next-intl";
import Text from "@/components/atoms/text";
import {
  AccountNotificationsField,
  AccountNotificationsFieldType,
} from "@/constants/enums/accountNotifications";
import { useNotifications } from "@/hooks/useNotifications";

const EmailField = () => {
  const { allOffersUpdatesEmail } = useNotifications();

  const t = useTranslations("account.notifications");
  const styles = ACCOUNT_NOTIFICATIONS_STYLES;
  const field = AccountNotificationsField.allOffersUpdates;
  const fieldType = AccountNotificationsFieldType.email;

  return (
    <Stack
      direction={"row"}
      justifyContent="space-between"
      alignItems="center"
      spacing={styles.SPACING}
      width={styles.FIELD_WIDTH}
    >
      <Stack>
        <Text text={t("email")} variant={TypographyVariant.h6} bold={false} />
        <Status isEnabled={allOffersUpdatesEmail} />
      </Stack>
      <NotificationsSwitch
        key={String(allOffersUpdatesEmail)}
        field={field}
        fieldType={fieldType}
        value={allOffersUpdatesEmail}
      />
    </Stack>
  );
};

export default EmailField;
