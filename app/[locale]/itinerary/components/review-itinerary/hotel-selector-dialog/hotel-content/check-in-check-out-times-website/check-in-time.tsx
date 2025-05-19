import Text from "@/components/atoms/text";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../../styles";

const CheckInTime = () => {
  const { hotel } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT
      .CHECK_IN_CHECK_OUT_TIMES_WEBSITE;

  return (
    hotel?.check_in_time && (
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
            text={t("checkInTime")}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={true}
          />
          {/* value */}
          <Text
            text={hotel?.check_in_time ?? ""}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={false}
          />
        </Stack>
      </Grid>
    )
  );
};

export default CheckInTime;
