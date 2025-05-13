"use client";

import Alert from "@/components/molecules/alert";
import { useNotifications } from "@/hooks/useNotifications";
import { Box } from "@mui/material";
import { useEffect } from "react";
import BreadcrumbNavigator from "./breadcrumb-navigator/breadcrumb-navigator";
import { ACCOUNT_NOTIFICATIONS_STYLES } from "./styles";
import TravelTipsAndOffersSection from "./travel-tips-and-offers-section/travel-tips-and-offers-section";
import UnsubAllOffersAndUpdatesSection from "./unsub-all-offers-and-updates-section/unsub-all-offers-and-updates-section";

const AccountNotifications = ({}: {}) => {
  const {
    getUserNotificationsSettings,
    setNewsletterEmail,
    setNewsletterPushNotifications,
    setAllOffersUpdatesEmail,
    setAllOffersUpdatesPushNotifications,
    showAlert,
    setShowAlert,
    alertText,
    alertType,
  } = useNotifications();

  const styles = ACCOUNT_NOTIFICATIONS_STYLES;

  useEffect(() => {
    if (getUserNotificationsSettings.data) {
      const notificationsSettings = getUserNotificationsSettings.data;
      setNewsletterEmail(notificationsSettings.newsletter.email);
      setNewsletterPushNotifications(
        notificationsSettings.newsletter.pushNotifications
      );
      setAllOffersUpdatesEmail(notificationsSettings.allOffersUpdates.email);
      setAllOffersUpdatesPushNotifications(
        notificationsSettings.allOffersUpdates.pushNotifications
      );
    }
  }, [getUserNotificationsSettings.data]);

  return (
    <Box>
      <Box marginY={styles.MARGIN}>
        <BreadcrumbNavigator />
        <TravelTipsAndOffersSection />
        <UnsubAllOffersAndUpdatesSection />
      </Box>
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertText={alertText}
        alertType={alertType}
      />
    </Box>
  );
};

export default AccountNotifications;
