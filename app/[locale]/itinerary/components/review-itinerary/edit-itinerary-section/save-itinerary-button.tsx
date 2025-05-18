import Text from "@/components/atoms/text";
import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import { TypographyVariant } from "@/constants/enums/theme";
import { useItinerary } from "@/hooks/useItinerary";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const SaveItineraryButton = () => {
  const { params, setItineraryPageStep } = useItinerary();
  const {
    isEditing,
    utils,
    setShowAlert,
    setIsSavingItinerary,
    saveItineraryToUser,
    isSavingitinerary,
  } = useReviewItinerary();

  const { data: session } = useSession();
  const email = session?.user.email;

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EDIT_ITINERARY_SECTION;

  // by default, anyone can save the itinerary
  const handleOnClick = async () => {
    setShowAlert(false);

    // if the user is logged in
    if (session?.user && email) {
      setIsSavingItinerary(true);
      const data = {
        email,
        itineraryId: params.id,
      };
      await saveItineraryToUser.mutateAsync(data);
      setIsSavingItinerary(false);
      setShowAlert(true);
      utils.invalidate();
    } else {
      window.scrollTo(0, 0);
      setItineraryPageStep(ItineraryPageStep.saveItinerary);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleOnClick}
      color="secondary"
      disabled={isEditing}
    >
      <Stack direction="row" spacing={styles.SPACING}>
        {isSavingitinerary && (
          <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
        )}
        <Text
          text={isSavingitinerary ? t("savingItinerary") : t("saveItinerary")}
          variant={TypographyVariant.button}
          bold={false}
        />
      </Stack>
    </Button>
  );
};

export default SaveItineraryButton;
