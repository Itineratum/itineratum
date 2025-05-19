import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { TypographyVariant } from "@/constants/enums/theme";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";
import HotelContent from "./hotel-content/hotel-content";
import HotelTabs from "./hotel-tabs";
import SelectHotelButton from "./select-hotel-button";

const HotelSelectorDialog = ({}: {}) => {
  const { hotelSelectorDialogOpen } = useReviewItinerary();
  const {
    hotels,
    destinationIndex,
    handleOnClose,
    destination,
    showAlert,
    setShowAlert,
    alertText,
    alertType,
  } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG;

  return (
    hotels && (
      <Dialog
        key={destinationIndex}
        open={hotelSelectorDialogOpen}
        fullScreen={false}
        onClose={handleOnClose}
        maxWidth="lg"
        sx={{ overflow: "scroll" }}
      >
        {/* title and hotel tabs */}
        <DialogTitle>
          <Stack direction="column" spacing={styles.SPACING}>
            <Text
              text={`${t("selectHotel")} ${destination}`}
              variant={TypographyVariant.h4}
              bold={false}
            />
            <HotelTabs />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack
            key={destinationIndex}
            direction="column"
            spacing={styles.SPACING}
          >
            <HotelContent />
            <SelectHotelButton />
            <Alert
              showAlert={showAlert}
              setShowAlert={setShowAlert}
              alertText={alertText}
              alertType={alertType}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    )
  );
};

export default HotelSelectorDialog;
