import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

const CancelButton = () => {
  const {
    setCurrentEdit,
    setEdits,
    setIsEditing,
    setEvents,
    isEditing,
    backupEvents,
    isSavingEdits,
  } = useReviewItinerary();

  const t = useTranslations("itinerary");

  const handleOnClick = () => {
    setCurrentEdit(null);
    setEdits([]);
    setIsEditing(!isEditing);
    setEvents(backupEvents);
  };

  return (
    <Button
      variant="contained"
      onClick={handleOnClick}
      sx={{ backgroundColor: colorsConst.palette.text.secondary }}
      disabled={isSavingEdits}
    >
      <Text
        text={t("cancel")}
        variant={TypographyVariant.button}
        bold={true}
        color={colorsConst.palette.text.primary}
      />
    </Button>
  );
};

export default CancelButton;
