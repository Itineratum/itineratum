import Text from "@/components/atoms/text";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import MapSection from "./map-section/map-section";
import { ITINERARY_STYLES } from "../../../../styles";

const Location = () => {
  const { hotel, destination } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT
      .AMENITIES_LOCATION;

  return (
    hotel?.coordinates && (
      <Grid
        item
        xs={12}
        md={styles.LOCATION_GRID}
        display="flex"
        justifyContent={styles.JUSTIFY_CONTENT}
      >
        <Stack
          direction="column"
          spacing={styles.SPACING}
          display="flex"
          alignItems="center"
        >
          {/* label */}
          <Text
            text={`${t("location")} ${destination}`}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={true}
          />
          <MapSection />
        </Stack>
      </Grid>
    )
  );
};

export default Location;
