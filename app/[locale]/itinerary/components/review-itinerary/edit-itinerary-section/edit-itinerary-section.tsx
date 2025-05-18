import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";
import CancelButton from "./cancel-button";
import EditSaveButton from "./edit-save-button";
import SaveItineraryButton from "./save-itinerary-button";

const EditItinerarySection = () => {
  const { canEdit, isEditing, canSaveItinerary, showAlert, setShowAlert } =
    useReviewItinerary();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EDIT_ITINERARY_SECTION;

  return (
    <Stack direction="column" spacing={styles.SPACING}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: styles.SPACING,
          justifyContent: { xs: "center", md: "flex-end" },
        }}
      >
        {canEdit && isEditing && <CancelButton />}
        {canEdit && <EditSaveButton />}
        {!isEditing && canSaveItinerary && <SaveItineraryButton />}
      </Box>
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertText={t("itinerarySaved")}
        alertType={AlertType.success}
      />
      {isEditing && (
        <Text
          text={t("editInstructions")}
          variant={TypographyVariant.body1}
          bold={true}
        />
      )}
    </Stack>
  );
};

export default EditItinerarySection;
