import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddEvent } from "@/hooks/useAddEvent";
import { Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { ITINERARY_STYLES } from "../../styles";

const CheckOutTimeField = () => {
  const { isHotelEvent, control, errors, checkOutTime } = useAddEvent();

  const t = useTranslations("itinerary.addEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.ADD_EVENT_DIALOG;

  return (
    isHotelEvent && (
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={styles.SPACING}
      >
        <Text
          text={t("checkOutTime") + ":"}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name={"checkOutTime"}
            control={control}
            rules={{
              required: t("checkOutTimeErrorMessage"),
            }}
            render={({ field }) => (
              <TimePicker
                {...field}
                value={checkOutTime}
                slotProps={{
                  textField: {
                    error: !!errors.checkOutTime,
                    helperText: errors.checkOutTime
                      ? (errors.checkOutTime.message as string)
                      : "",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Stack>
    )
  );
};

export default CheckOutTimeField;
