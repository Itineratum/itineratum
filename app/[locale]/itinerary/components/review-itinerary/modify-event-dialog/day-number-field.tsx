import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useModifyEvent } from "@/hooks/useModifyEvent";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { ITINERARY_STYLES } from "../../styles";

const DayNumberField = () => {
  const { itineraryData } = useReviewItinerary();
  const { control, errors, dayNum, setValue } = useModifyEvent();
  const numOfDays = itineraryData?.itinerary.length;

  const t = useTranslations("itinerary.modifyEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.MODIFY_EVENT_DIALOG;

  const handleOnChange = (event: SelectChangeEvent<string>) => {
    const selectedDayNum = event.target.value;
    setValue("dayNum", Number(selectedDayNum), {
      shouldValidate: true,
    });
  };

  const dayNumberOptions = Array.from(Array(numOfDays).keys()).map(
    (dayNum) => dayNum + 1
  );

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      spacing={styles.FIELD_SPACING}
    >
      {/* label */}
      <Text
        text={t("dayNum") + ":"}
        variant={TypographyVariant.h6}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
      <FormControl fullWidth>
        <Controller
          name={"dayNum"}
          control={control}
          rules={{ required: t("dayNumErrorMessage") }}
          render={({ field }) => (
            <Select
              value={String(dayNum) || "1"}
              defaultValue={""}
              onChange={handleOnChange}
              fullWidth={true}
              required
              displayEmpty
            >
              {/* hint */}
              <MenuItem value="" disabled>
                {t("dayNumDescription")}
              </MenuItem>
              {/* day number option items */}
              {dayNumberOptions.map((dayNum) => (
                <MenuItem key={dayNum} value={dayNum}>
                  {dayNum}
                </MenuItem>
              ))}
              {/* 
              {Object.values(EventTimeOfDay).map((timeOfDay) => (
                <MenuItem key={dayNum} value={dayNum}>
                  {dayNum}
                </MenuItem>
              ))} */}
            </Select>
          )}
        />
        <FormHelperText error={!!errors.dayNum}>
          {errors.dayNum?.message}
        </FormHelperText>
      </FormControl>
    </Stack>
  );
};

export default DayNumberField;
