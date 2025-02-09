import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import { Box, Grid, Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

const DateFields = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step1");
  const spacing: number = 4;
  const mobileSpacing = 1;
  const textLabelMarginRight: number = 2;
  const startDate = "startDate";
  const endDate = "endDate";
  const userRequestedDestinations = "userRequestedDestinations";

  const [dateError, setDateError] = useState<boolean>(false);

  const validateDates = (
    from: dayjs.Dayjs | null,
    to: dayjs.Dayjs | null,
    numOfDestinations: number,
  ) => {
    if (from && to) {
      return to.diff(from, "days") + 1 >= numOfDestinations;
    }
    return false;
  };

  const fromDateField = () => {
    const validateFromDate = (value: any) => {
      const isValid = validateDates(
        value,
        fields.getValues(endDate),
        fields.getValues(userRequestedDestinations).length,
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
      fields.setValue(startDate, value?.startOf("day")!);

      if (fields.getValues(endDate))
        fields.setValue(endDate, fields.getValues(endDate).startOf("day"));

      // reset the startDate and endDate for all destinations
      fields.setValue(
        userRequestedDestinations,
        fields.getValues(userRequestedDestinations).map((destination) => ({
          ...destination,
          startDate: value?.startOf("day")!,
          endDate: value?.startOf("day")!,
        })),
      );

      fields.trigger(startDate);
      fields.trigger(endDate);
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
          gap: { xs: mobileSpacing, md: 0 },
        }}
      >
        <Box mr={textLabelMarginRight}>
          <Text
            text={t("from") + ":"}
            variant={TypographyVariant.h4}
            bold={true}
          />
        </Box>
        <Controller
          name={startDate}
          control={fields.control}
          defaultValue={dayjs()}
          rules={{
            validate: (value) => {
              return validateFromDate(value);
            },
          }}
          render={({ field, fieldState }) => (
            <DatePicker
              {...field}
              format="DD/MM/YYYY"
              label={t("from")}
              defaultValue={dayjs()}
              minDate={dayjs()}
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

  const toDateField = () => {
    const valiidateToDate = (value: any) => {
      const isValid = validateDates(
        fields.getValues(startDate),
        value,
        fields.getValues(userRequestedDestinations).length,
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
      fields.setValue(endDate, value?.startOf("day")!);
      fields.setValue(startDate, fields.getValues(startDate).startOf("day"));
      fields.trigger(startDate);
      fields.trigger(endDate);
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
          gap: { xs: mobileSpacing, md: 0 },
        }}
      >
        <Box mr={textLabelMarginRight}>
          <Text
            text={t("to") + ":"}
            variant={TypographyVariant.h4}
            bold={true}
          />
        </Box>
        <Controller
          name={endDate}
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
              minDate={fields.getValues(startDate) ?? dayjs()}
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

  const dateErrorMessage = () => {
    return dateError ? (
      <Text
        text={t("dateErrorMessage")}
        variant={TypographyVariant.h6}
        bold={true}
        color="red"
      />
    ) : null;
  };

  return (
    <Grid item xs={12} md={6} alignItems="flex-start" width="100%">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={spacing} direction="column" alignItems="center">
          {fromDateField()}
          {toDateField()}
        </Stack>
      </LocalizationProvider>
      {dateErrorMessage()}
    </Grid>
  );
};

export default DateFields;
