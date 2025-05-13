import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ACCOUNT_NOTIFICATIONS_STYLES } from "../styles";
import EmailField from "./email-field";
import Header from "./header";
import PushNotificationsField from "./push-notifications-field";

const TravelTipsAndOffersSection = () => {
  const t = useTranslations("account.notifications");
  const styles = ACCOUNT_NOTIFICATIONS_STYLES;

  return (
    <Stack spacing={styles.FIELD_SPACING} marginTop={styles.MARGIN}>
      <Header />
      <Text text={t("newsletter")} variant={TypographyVariant.h6} bold={true} />
      <EmailField />
      <PushNotificationsField />
    </Stack>
  );
};

export default TravelTipsAndOffersSection;
