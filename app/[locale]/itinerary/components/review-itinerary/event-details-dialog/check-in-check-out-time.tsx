import Text from "@/components/atoms/text";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const CheckInCheckOutTime = () => {
  const { selectedEvent } = useReviewItinerary();
  const event = selectedEvent;

  const t = useTranslations("itinerary.eventDetailsCard");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_DETAILS_DIALOG;

  return (
    event?.is_hotel &&
    event.checkInTime &&
    event.checkOutTime && (
      <Grid container>
        <Grid item xs={12} md={6}>
          {/* check in time */}
          <Stack direction="row" spacing={styles.SPACING}>
            <Text
              text={t("checkInTime") + ": "}
              variant={styles.TYPOGRAPHY_VARIANT}
              bold={true}
              color={colorsConst.palette.text.primary}
            />
            <Text
              text={event?.checkInTime ?? ""}
              variant={styles.TYPOGRAPHY_VARIANT}
              bold={false}
              color={colorsConst.palette.text.primary}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* check out time */}
          <Stack direction="row" spacing={styles.SPACING}>
            <Text
              text={t("checkOutTime") + ": "}
              variant={styles.TYPOGRAPHY_VARIANT}
              bold={true}
              color={colorsConst.palette.text.primary}
            />
            <Text
              text={event?.checkOutTime ?? ""}
              variant={styles.TYPOGRAPHY_VARIANT}
              bold={false}
              color={colorsConst.palette.text.primary}
            />
          </Stack>
        </Grid>
      </Grid>
    )
  );
};

export default CheckInCheckOutTime;
