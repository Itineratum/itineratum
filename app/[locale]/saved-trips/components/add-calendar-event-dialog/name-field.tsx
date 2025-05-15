import Text from "@/components/atoms/text";
import TextInputField from "@/components/molecules/text-input-field";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddCalendarEvent } from "@/hooks/useAddCalendarEvent";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../styles";

const NameField = () => {
  const { control, errors, name } = useAddCalendarEvent();

  const t = useTranslations("savedTrips.addCalendarEventDialog");
  const styles = SAVED_TRIPS_STYLES.ADD_CALENDAR_EVENT_DIALOG;

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      spacing={styles.FIELD_SPACING}
    >
      <Text
        text={t("name") + ":"}
        variant={TypographyVariant.h6}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
      <TextInputField
        name={"name"}
        label={t("nameDescription")}
        control={control}
        errorMessage={t("nameError")}
        errors={errors}
        value={name}
      />
    </Stack>
  );
};

export default NameField;
