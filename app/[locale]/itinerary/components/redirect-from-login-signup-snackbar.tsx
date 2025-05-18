import { useItinerary } from "@/hooks/useItinerary";
import { Snackbar } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "./styles";

const RedirectFromLoginSignupSnackbar = () => {
  const { setShowSnackbar, showSnackbar } = useItinerary();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES;

  const handleOnClose = (event?: any, reason?: any) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  return (
    <Snackbar
      open={showSnackbar}
      onClose={handleOnClose}
      autoHideDuration={styles.SNACKBAR_AUTO_HIDE_DURATIOON}
      message={t("itinerarySaved")}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    />
  );
};

export default RedirectFromLoginSignupSnackbar;
