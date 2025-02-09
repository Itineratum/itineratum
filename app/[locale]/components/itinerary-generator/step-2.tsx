import Text from "@/components/atoms/text";
import { getCurrencySymbol } from "@/constants/enums/currency";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import { isValidIntegerRegex } from "@/utils/itineraryGeneratorValidation";
import { Box, Grid, Stack, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

const Step2 = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step2");

  const spacing: number = 4;
  const mobileSpacing = 2;
  const textLabelMarginRight: number = 2;
  const budget = "budget";
  const totalHotelRooms = "totalHotelRooms";
  const numAdults = "numPeopleTravelling.adults";
  const numChildren = "numPeopleTravelling.children";

  const [currency, setCurrency] = useState<string | undefined>("");

  useEffect(() => {
    // TODO: to see how to change currency automatically based on the selected currency in the CurrencySwitcher component
    const storedCurrency = getCookie("currency");
    setCurrency(getCurrencySymbol(storedCurrency!));
  }, [getCookie("currency")]);

  const budgetHotelRoomsSection = () => {
    const budgetField = () => {
      const width: string = "45%";

      const budgetValidation = (budgetInput: number) => {
        const isValid = budgetInput > 0;
        return isValid ? true : t("budgetErrorMessage");
      };

      return (
        <Box
          display="flex"
          sx={{
            width: "100%",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: mobileSpacing, md: 0 },
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <Box
            mr={textLabelMarginRight}
            display="flex"
            sx={{ width: { xs: "100%", md: width }, flexShrink: 0 }}
          >
            <Text
              text={t("budget") + ": " + currency?.toUpperCase()}
              variant={TypographyVariant.h4}
              bold={true}
            />
          </Box>
          <Controller
            name={budget}
            control={fields.control}
            rules={{
              validate: budgetValidation,
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...fields.register(budget)}
                variant="outlined"
                label={t("budgetDescription")}
                InputLabelProps={{
                  style: {
                    color: colorsConst.palette.text.grey,
                    fontSize: "12px",
                  },
                }}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value);
                  fields.trigger(budget);
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: isValidIntegerRegex(),
                }}
                error={fieldState.invalid}
                helperText={fieldState.invalid ? t("budgetErrorMessage") : ""}
                fullWidth
              />
            )}
          />
        </Box>
      );
    };

    const totalHotelRoomsField = () => {
      const width: string = "55%";

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
            gap: { xs: mobileSpacing, md: 0 },
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <Box
            display="flex"
            sx={{ width: { xs: "100%", md: width }, flexShrink: 0 }}
          >
            <Text
              text={t("hotelRooms") + ":"}
              variant={TypographyVariant.h4}
              bold={true}
            />
          </Box>
          <Controller
            name={totalHotelRooms}
            control={fields.control}
            rules={{
              validate: totalHotelRoomsValidation,
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...fields.register(totalHotelRooms)}
                variant="outlined"
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value);
                  fields.trigger(totalHotelRooms);
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: isValidIntegerRegex(),
                }}
                error={fieldState.invalid}
                helperText={
                  fieldState.invalid ? t("hotelRoomsErrorMessage") : ""
                }
                fullWidth
              />
            )}
          />
        </Box>
      );
    };

    return (
      <Grid container spacing={spacing} alignItems="center">
        <Grid item xs={12} md={5}>
          {budgetField()}
        </Grid>
        <Grid item xs={12} md={7}>
          {totalHotelRoomsField()}
        </Grid>
      </Grid>
    );
  };

  const numPeopleTravellingSection = () => {
    const numPeopleTravellingLabel = () => {
      return (
        <Text
          text={t("numTravellers") + ":"}
          variant={TypographyVariant.h4}
          bold={true}
        />
      );
    };

    const numPeopleTravellingFields = () => {
      const adultsField = () => {
        const numAdultsValidation = (numAdultsInput: number) => {
          const isValid = numAdultsInput >= 1;
          return isValid ? true : t("adultsErrorMessage");
        };

        const label = () => {
          return (
            <Text
              text={t("adults")}
              variant={TypographyVariant.h5}
              bold={true}
            />
          );
        };

        const inputField = () => {
          return (
            <Controller
              name={numAdults}
              control={fields.control}
              rules={{
                validate: numAdultsValidation,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...fields.register(numAdults)}
                  variant="outlined"
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    fields.trigger(numAdults);
                  }}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: isValidIntegerRegex(),
                  }}
                  error={fieldState.invalid}
                  helperText={fieldState.invalid ? t("adultsErrorMessage") : ""}
                  fullWidth
                />
              )}
            />
          );
        };

        return (
          <Stack
            spacing={0}
            direction="column"
            alignItems="flex-start"
            sx={{ width: "100%" }}
          >
            {label()}
            {inputField()}
          </Stack>
        );
      };

      const childrenField = () => {
        const numChildrenValidation = (numChildrenInput: number) => {
          const isValid = numChildrenInput >= 0;
          return isValid ? true : t("childrenErrorMessage");
        };

        const label = () => {
          return (
            <Text
              text={t("children")}
              variant={TypographyVariant.h5}
              bold={true}
            />
          );
        };

        const inputField = () => {
          return (
            <Controller
              name={numChildren}
              control={fields.control}
              rules={{
                validate: numChildrenValidation,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...fields.register(numChildren)}
                  variant="outlined"
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    fields.trigger(numChildren);
                  }}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: isValidIntegerRegex(),
                  }}
                  error={fieldState.invalid}
                  helperText={
                    fieldState.invalid ? t("childrenErrorMessage") : ""
                  }
                  fullWidth
                />
              )}
            />
          );
        };

        return (
          <Stack
            spacing={0}
            direction="column"
            alignItems="flex-start"
            width="100%"
          >
            {label()}
            {inputField()}
          </Stack>
        );
      };

      return (
        <Stack
          spacing={spacing}
          direction="column"
          alignItems="flex-start"
          width="100%"
        >
          {adultsField()}
          {childrenField()}
        </Stack>
      );
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: spacing,
          alignItems: "flex-start",
        }}
      >
        {numPeopleTravellingLabel()}
        {numPeopleTravellingFields()}
      </Box>
    );
  };

  return (
    <Stack
      spacing={spacing + 5}
      direction="column"
      alignItems="center"
      sx={{ display: "flex", alignItems: "flex-end" }}
    >
      {budgetHotelRoomsSection()}
      {numPeopleTravellingSection()}
    </Stack>
  );
};

export default Step2;
