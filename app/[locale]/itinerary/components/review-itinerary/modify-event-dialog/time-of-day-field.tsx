import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useModifyEvent } from "@/hooks/useModifyEvent";
import { EventTimeOfDay } from "@/lib/pythonBackend/types";
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
  const { control, errors, setValue, timeOfDay } = useModifyEvent();

  const t = useTranslations("itinerary.modifyEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.MODIFY_EVENT_DIALOG;

  const handleOnChange = (event: SelectChangeEvent<string>) => {
    const selectedTimeOfDay = event.target.value;
    setValue("timeOfDay", selectedTimeOfDay as EventTimeOfDay, {
      shouldValidate: true,
    });
  };

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      spacing={styles.FIELD_SPACING}
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
              {Object.values(EventTimeOfDay).map((timeOfDay) => (
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
