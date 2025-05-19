import Text from "@/components/atoms/text";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { HotelType } from "@/lib/pythonBackend/types";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import HotelIcon from "@mui/icons-material/Hotel";
import { Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../../styles";

const Type = () => {
  const { hotel } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT
      .RATE_CLASS_TYPE;

  const hotelType: HotelType = HotelType[hotel?.type as keyof typeof HotelType];

  return (
    hotel?.type && (
      <Grid
        item
        xs={12}
        md={4}
        display="flex"
        justifyContent={styles.JUSTIFY_CONTENT}
      >
        <Stack
          direction="column"
          spacing={styles.VALUE_SPACING}
          display="flex"
          alignItems="center"
        >
          {/* label */}
          <Text
            text={t("type")}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={true}
          />
          {/* value */}
          <Stack direction="row" spacing={styles.VALUE_SPACING}>
            {hotelType === HotelType.hotel ? (
              <HotelIcon />
            ) : (
              <HolidayVillageIcon />
            )}
            <Text
              text={`${hotelType}`}
              variant={styles.TYPOGRAPHY_VARIANT}
              bold={false}
            />
          </Stack>
        </Stack>
      </Grid>
    )
  );
};

export default Type;
