import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

const SelectHotelButton = () => {
  const { setHotelSelectorDialogOpen, canEdit, isEditing, edits, dayPlan } =
    useReviewItinerary();

  const t = useTranslations("itinerary");

  const handleOnClick = () => {
    setHotelSelectorDialogOpen(true);
  };

  return (
    canEdit && (
      <Button
        variant="contained"
        onClick={handleOnClick}
        disabled={isEditing || edits.length > 0}
      >
        <Text
          text={`${t("hotelSelectorDialog.selectHotel")} ${dayPlan?.destination}`}
          variant={TypographyVariant.button}
          bold={true}
        />
      </Button>
    )
  );
};

export default SelectHotelButton;
