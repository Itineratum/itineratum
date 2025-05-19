import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { useItinerary } from "@/hooks/useItinerary";
import { useSaveItinerary } from "@/hooks/useSaveItinerary";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../styles";

const ProceedButton = () => {
  const { params } = useItinerary();
  const {
    setShowAlert,
    trigger,
    setIsSendingEmail,
    isSendingEmail,
    showAlert,
    email,
    emailItinerary,
  } = useSaveItinerary();
  const itineraryId = params.id;

  const { data: session } = useSession();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.SAVE_ITINERARY;

  const handleOnClick = async () => {
    setShowAlert(false);
    const emailValid = await trigger("email");

    if (emailValid) {
      setIsSendingEmail(true);
      const name = session?.user.name;
      const data = {
        email,
        name,
        itineraryId,
      };
      await emailItinerary.mutateAsync(data);
      setShowAlert(true);
      setIsSendingEmail(false);
    }
  };

  return (
    <Stack
      direction="column"
      display="flex"
      width="100%"
      alignItems="flex-end"
      spacing={styles.FIELD_SPACING}
    >
      <Button
        variant="contained"
        disabled={isSendingEmail}
        onClick={handleOnClick}
      >
        <Stack direction="row" spacing={styles.FIELD_SPACING}>
          {isSendingEmail && (
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
          )}
          <Text
            text={isSendingEmail ? t("emailingItinerary") : t("proceed")}
            variant={TypographyVariant.button}
            bold={false}
          />
        </Stack>
      </Button>
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertText={t("emailSuccess")}
        alertType={AlertType.success}
      />
    </Stack>
  );
};

export default ProceedButton;
