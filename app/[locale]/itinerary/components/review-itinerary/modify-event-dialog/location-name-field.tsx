import Text from "@/components/atoms/text";
import TextInputField from "@/components/molecules/text-input-field";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useModifyEvent } from "@/hooks/useModifyEvent";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const LocationNameField = () => {
  const { control, errors, locationName } = useModifyEvent();

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
        text={t("locationName") + ":"}
        variant={TypographyVariant.h6}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
      <TextInputField
        name={"locationName"}
        label={t("locationNameDescription")}
        control={control}
        errorMessage={t("locationNameErrorMessage")}
        errors={errors}
        value={locationName}
      />
    </Stack>
  );
};

export default LocationNameField;
