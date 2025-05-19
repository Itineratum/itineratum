import Text from "@/components/atoms/text";
import TextInputField from "@/components/molecules/text-input-field";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useModifyEvent } from "@/hooks/useModifyEvent";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const LocationCityField = () => {
  const { control, errors, locationCity } = useModifyEvent();

  const t = useTranslations("itinerary.modifyEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.MODIFY_EVENT_DIALOG;

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      spacing={styles.FIELD_SPACING}
    >
      <Text
        text={t("locationCity") + ":"}
        variant={TypographyVariant.h6}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
      <TextInputField
        name={"locationCity"}
        label={t("locationCityDescription")}
        control={control}
        errorMessage={t("locationCityErrorMessage")}
        errors={errors}
        value={locationCity}
      />
    </Stack>
  );
};

export default LocationCityField;
