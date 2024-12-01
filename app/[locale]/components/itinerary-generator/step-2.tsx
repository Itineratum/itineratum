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
  const textLabelMarginRight: number = 2;
  const budget = "budget";
  const totalHotelRooms = "totalHotelRooms";
  const numAdults = "numPeopleTravelling.adults";
  const numChildren = "numPeopleTravelling.children";

  const budgetHotelRoomsSection = () => {
    const [currency, setCurrency] = useState<string | undefined>("");

    useEffect(() => {
      // TODO: to see how to change currency automatically based on the selected currency in the CurrencySwitcher component
      const storedCurrency = getCookie("currency");
      setCurrency(getCurrencySymbol(storedCurrency!));
    }, [getCookie("currency")]);

    const budgetField = () => {
      const width: string = "45%";

      const budgetValidation = (budgetInput: number) => {
        const isValid = budgetInput > 0;
        return isValid ? true : t("budgetErrorMessage");
      };

      return (
        <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
          <Box
            mr={textLabelMarginRight}
            display="flex"
            sx={{ width, flexShrink: 0 }}
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
        <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
          <Box display="flex" sx={{ width, flexShrink: 0 }}>
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
              />
            )}
          />
        </Box>
      );
    };

    return (
      <Grid container spacing={spacing} direction="row" alignItems="center">
        <Grid item xs={5}>
          {budgetField()}
        </Grid>
        <Grid item xs={7}>
          {" "}
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
                />
              )}
            />
          );
        };

        return (
          <Stack spacing={0} direction="column" alignItems="flex-start">
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
                />
              )}
            />
          );
        };

        return (
          <Stack spacing={0} direction="column" alignItems="flex-start">
            {label()}
            {inputField()}
          </Stack>
        );
      };

      return (
        <Stack spacing={spacing} direction="column" alignItems="flex-start">
          {adultsField()}
          {childrenField()}
        </Stack>
      );
    };

    return (
      <Stack spacing={spacing} direction="row" alignItems="flex-start">
        {numPeopleTravellingLabel()}
        {numPeopleTravellingFields()}
      </Stack>
    );
  };

  return (
    <Stack spacing={spacing + 5} direction="column" alignItems="center">
      {budgetHotelRoomsSection()}
      {numPeopleTravellingSection()}
    </Stack>
  );
};

export default Step2;
