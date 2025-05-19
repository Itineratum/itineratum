import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddEvent } from "@/hooks/useAddEvent";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { EventTimeOfDay } from "@/lib/pythonBackend/types";
import { getTimeOfDayOptions } from "@/lib/pythonBackend/utils";
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

const TimeOfDayField = () => {
  const { indexToAddEventTo, events } = useReviewItinerary();
  const { setValue, control, errors, timeOfDay } = useAddEvent();

  const t = useTranslations("itinerary.addEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.ADD_EVENT_DIALOG;

  const handleOnChange = (event: SelectChangeEvent<string>) => {
    const selectedTimeOfDay = event.target.value;
    setValue("timeOfDay", selectedTimeOfDay as EventTimeOfDay, {
      shouldValidate: true,
    });
  };

  const timeOfDayOptions = getTimeOfDayOptions(
    indexToAddEventTo ?? 0,
    events,
    false,
  );

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      spacing={styles.SPACING}
    >
      {/* label */}
      <Text
        text={t("timeOfDay") + ":"}
        variant={TypographyVariant.h6}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
      <FormControl fullWidth>
        <Controller
          name={"timeOfDay"}
          control={control}
          rules={{ required: t("timeOfDayErrorMessage") }}
          render={({ field }) => (
            <Select
              value={timeOfDay || ""}
              defaultValue={""}
              onChange={handleOnChange}
              fullWidth={true}
              required
              displayEmpty
            >
              {/* hint */}
              <MenuItem value="" disabled>
                {t("timeOfDayDescription")}
              </MenuItem>
              {/* time of day option items */}
              {timeOfDayOptions.map((timeOfDay) => (
                <MenuItem key={timeOfDay} value={timeOfDay}>
                  {timeOfDay}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <FormHelperText error={!!errors.timeOfDay}>
          {errors.timeOfDay?.message}
        </FormHelperText>
      </FormControl>
    </Stack>
  );
};

export default TimeOfDayField;
