import Text from "@/components/atoms/text";
import TextInputField from "@/components/molecules/text-input-field";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddEvent } from "@/hooks/useAddEvent";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const LocationCityField = () => {
  const { isHotelEvent, control, errors, locationCity } = useAddEvent();

  const t = useTranslations("itinerary.addEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.ADD_EVENT_DIALOG;

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      spacing={styles.SPACING}
    >
      <Text
        text={`${isHotelEvent ? t("hotelCity") : t("locationCity")}:`}
        variant={TypographyVariant.h6}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
      <TextInputField
        name={"locationCity"}
        label={
          isHotelEvent
            ? t("hotelCityDescription")
            : t("locationCityDescription")
        }
        control={control}
        errorMessage={
          isHotelEvent ? t("hotelCityErrorMessage") : t("locationCityErrorMessage")
        }
        errors={errors}
        value={locationCity}
      />
    </Stack>
  );
};

export default LocationCityField;
