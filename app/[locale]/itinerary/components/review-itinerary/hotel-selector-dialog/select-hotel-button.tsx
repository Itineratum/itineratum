import Text from "@/components/atoms/text";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const SelectHotelButton = () => {
  const { setSelectedHotels, selectedHotels } = useReviewItinerary();
  const {
    hotel,
    destinationIndex,
    itineraryId,
    setIsLoading,
    setAlertType,
    setAlertText,
    adjustItineraryHotels,
    destination,
    utils,
    setShowAlert,
    hotelSelected,
    isLoading,
  } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG;

  const handleOnClick = async () => {
    if (hotel) {
      const newSelectedHotels = [...selectedHotels];
      newSelectedHotels[destinationIndex] = hotel;
      setSelectedHotels(newSelectedHotels);
      const data = {
        itineraryId,
        selectedHotels: newSelectedHotels ?? [],
      };
      setIsLoading(true);
      await adjustItineraryHotels.mutateAsync(data);
      setAlertText(`${t("hotelSelected")} ${destination}`);
      setAlertType(AlertType.success);
      setIsLoading(false);
      utils.itinerary.getItinerary.invalidate();
    } else {
      setAlertText(t("selectedFailed"));
      setAlertType(AlertType.error);
    }

    setShowAlert(true);
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        onClick={handleOnClick}
        variant="contained"
        disabled={hotelSelected(hotel!) || isLoading}
      >
        {isLoading ? (
          <Stack direction="row" spacing={styles.SPACING - 2}>
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
            <Text
              text={t("selecting")}
              variant={TypographyVariant.button}
              bold={true}
            />
          </Stack>
        ) : (
          <Text
            text={hotelSelected(hotel!) ? t("alreadySelected") : t("select")}
            variant={TypographyVariant.button}
            bold={true}
          />
        )}
      </Button>
    </Box>
  );
};

export default SelectHotelButton;
