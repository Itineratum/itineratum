import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useItinerary } from "@/hooks/useItinerary";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ITINERARY_STYLES } from "../../styles";

const EditSaveButton = () => {
  const { params } = useItinerary();
  const {
    isEditing,
    setIsEditing,
    setIsSavingEdits,
    setEdits,
    utils,
    currentEdit,
    isSavingEdits,
    editItinerary,
    edits,
    dayNum,
    events,
  } = useReviewItinerary();
  const router = useRouter();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EDIT_ITINERARY_SECTION;

  // by default, only the user account that generated the itinerary can edit the itinerary
  // this means that if some un-logged in user generated the itinerary, they cannot edit the itinerary since they were not logged in

  const handleOnClick = async () => {
    if (isEditing && edits) {
      setIsSavingEdits(true);
      const data = {
        itineraryId: params.id,
        dayNum,
        newEvents: events,
        edits,
      };
      await editItinerary.mutateAsync(data);
    }

    setIsEditing(!isEditing);
    setIsSavingEdits(false);
    setEdits([]);
    utils.itinerary.getItinerary.invalidate();
    router.refresh();
  };

  return (
    <Button
      variant="contained"
      onClick={handleOnClick}
      color={isEditing ? "secondary" : "primary"}
      disabled={(isEditing && !currentEdit) || isSavingEdits}
      sx={{ width: "auto" }}
    >
      {isSavingEdits ? (
        <Stack direction="row" spacing={styles.SPACING}>
          <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
          <Text
            text={t("saving")}
            variant={TypographyVariant.button}
            bold={true}
          />
        </Stack>
      ) : (
        <Text
          text={isEditing ? t("save") : t("edit")}
          variant={TypographyVariant.button}
          bold={true}
        />
      )}
    </Button>
  );
};

export default EditSaveButton;
