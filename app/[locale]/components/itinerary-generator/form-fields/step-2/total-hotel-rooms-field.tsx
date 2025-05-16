import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { isValidIntegerRegex } from "@/utils/itineraryGeneratorValidation";
import { Box, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { HOME_STYLES } from "../../../styles";
const TotalHotelRoomsField = () => {
  const { fields } = useItineraryGenerator();

  const t = useTranslations("home.itineraryGenerator.step2");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_2;

  const totalHotelRoomsValidation = (totalHotelRoomsInput: number) => {
    const isValid = totalHotelRoomsInput > 0;
    return isValid ? true : t("hotelRoomsErrorMessage");
  };

  return (
    <Box
      display="flex"
      sx={{
        width: "100%",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: styles.MOBILE_SPACING, md: 0 },
        alignItems: { xs: "flex-start", md: "center" },
      }}
    >
      <Box
        display="flex"
        sx={{
          width: { xs: "100%", md: styles.TOTAL_HOTEL_ROOMS_FIELD_WIDTH },
          flexShrink: 0,
        }}
      >
        <Text
          text={t("hotelRooms") + ":"}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Box>
      <Controller
        name={"totalHotelRooms"}
        control={fields.control}
        rules={{
          validate: totalHotelRoomsValidation,
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...fields.register("totalHotelRooms")}
            variant="outlined"
            onChange={(event) => {
              const value = event.target.value;
              field.onChange(value);
              fields.trigger("totalHotelRooms");
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: isValidIntegerRegex(),
            }}
            error={fieldState.invalid}
            helperText={fieldState.invalid ? t("hotelRoomsErrorMessage") : ""}
            fullWidth
          />
        )}
      />
    </Box>
  );
};

export default TotalHotelRoomsField;
