import Text from "@/components/atoms/text";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { Grid, Rating, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../../styles";

const HotelClass = () => {
  const { hotel } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT;

  return (
    hotel?.hotel_class && (
      <Grid
        item
        xs={12}
        md={4}
        display="flex"
        justifyContent={styles.RATE_CLASS_TYPE.JUSTIFY_CONTENT}
      >
        <Stack
          direction="column"
          spacing={styles.RATE_CLASS_TYPE.SPACING}
          display="flex"
          alignItems="center"
        >
          {/* label */}
          <Text
            text={t("hotelClass")}
            variant={styles.RATE_CLASS_TYPE.TYPOGRAPHY_VARIANT}
            bold={true}
          />
          {/* value */}
          <Stack direction="row" spacing={styles.SPACING}>
            <Rating precision={0.1} value={hotel?.hotel_class ?? 0} readOnly />
            <Text
              text={
                hotel?.hotel_class
                  ? `${hotel.hotel_class} ${t("stars")}`
                  : t("na")
              }
              variant={styles.RATE_CLASS_TYPE.TYPOGRAPHY_VARIANT}
              bold={false}
            />
          </Stack>
        </Stack>
      </Grid>
    )
  );
};

export default HotelClass;
