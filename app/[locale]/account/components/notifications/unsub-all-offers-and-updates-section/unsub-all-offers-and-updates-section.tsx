import { Stack } from "@mui/material";
import { ACCOUNT_NOTIFICATIONS_STYLES } from "../styles";
import AllOffersAndUpdates from "./all-offers-and-updates";
import Description from "./description";
import EmailField from "./email-field";
import Header from "./header";
import PushNotificationsField from "./push-notifications-field";

const UnsubAllOffersAndUpdatesSection = () => {
  const styles = ACCOUNT_NOTIFICATIONS_STYLES;

  return (
    <Stack spacing={styles.FIELD_SPACING} marginTop={styles.FORM_MARGIN}>
      <Stack>
        <Header />
        <Description />
      </Stack>
      <AllOffersAndUpdates />
      <EmailField />
      <PushNotificationsField />
    </Stack>
  );
};

export default UnsubAllOffersAndUpdatesSection;
