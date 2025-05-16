import { HOME_STYLES } from "@/app/[locale]/components/styles";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { useStep1 } from "@/hooks/useStep1";
import { validateDates } from "@/utils/validateDates";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

const ToDateField = () => {
  const { fields } = useItineraryGenerator();
  const { setDateError } = useStep1();

  const t = useTranslations("home.itineraryGenerator.step1");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_1;

  const valiidateToDate = (value: any) => {
    const isValid = validateDates(
      fields.getValues("startDate"),
      value,
      fields.getValues("userRequestedDestinations").length,
    );

    if (!isValid) {
      setDateError(true);
      return t("dateErrorMessage");
    }

    setDateError(false);
    return true;
  };

  const handleOnChange = (field: any, value: any) => {
    field.onChange(value);
    fields.setValue("endDate", value?.startOf("day")!);
    fields.setValue("startDate", fields.getValues("startDate").startOf("day"));
    fields.trigger("startDate");
    fields.trigger("endDate");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        width: "100%",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        alignItems: { xs: "flex-start", md: "center" },
        gap: { xs: styles.MOBILE_SPACING, md: 0 },
      }}
    >
      <Box mr={styles.TEXT_LABEL_MARGIN_RIGHT}>
        <Text text={t("to") + ":"} variant={TypographyVariant.h4} bold={true} />
      </Box>
      <Controller
        name={"endDate"}
        control={fields.control}
        rules={{
          validate: (value) => {
            return valiidateToDate(value);
          },
        }}
        render={({ field, fieldState }) => (
          <DatePicker
            {...field}
            format="DD/MM/YYYY"
            label={t("to")}
            minDate={fields.getValues("startDate") ?? dayjs()}
            onChange={(value) => {
              handleOnChange(field, value);
            }}
            slotProps={{
              textField: {
                InputLabelProps: {
                  style: {
                    color: fieldState.invalid
                      ? "red"
                      : colorsConst.palette.text.grey,
                  },
                },
                error: fieldState.invalid,
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default ToDateField;
