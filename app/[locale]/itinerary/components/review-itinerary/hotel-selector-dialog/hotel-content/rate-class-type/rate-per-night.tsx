import Text from "@/components/atoms/text";
import { Currency } from "@/constants/enums/currency";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../../styles";

const RatePerNight = () => {
  const { currency, hotel } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT
      .RATE_CLASS_TYPE;

  return (
    hotel?.rate_per_night && (
      <Grid
        item
        xs={12}
        md={4}
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
            text={t("ratePerNight")}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={true}
          />
          {/* value */}
          <Text
            text={`${Currency[currency as unknown as keyof typeof Currency]} ${hotel?.rate_per_night}`}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={false}
          />
        </Stack>
      </Grid>
    )
  );
};

export default RatePerNight;
