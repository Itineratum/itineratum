"use client";

import { countryInfoList } from "@/constants/enums/country";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import urlConst from "@/constants/urls.json";
import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  MenuItem,
  TextField,
} from "@mui/material";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useForm,
} from "react-hook-form";
import Text from "../atoms/text";

const SignUpForm = () => {
  const t = useTranslations();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const color = colorsConst.components.textField;
  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";
  const formFieldBorderRadius: number = 2;
  const formFieldStyling: Object = {
    backgroundColor: color.backgroundColor,
    borderRadius: formFieldBorderRadius,
    "& .MuiFilledInput-root": {
      borderRadius: formFieldBorderRadius,
      "&:before, &:after": {
        borderBottom: "none",
      },
    },
    "& .MuiInputBase-input": {
      borderRadius: formFieldBorderRadius,
    },
  };

  const countryId = "country";
  const countryCodeId = "countryCode";
  const numberId = "number";

  const country = watch(countryId);
  const number = watch(numberId);

  useEffect(() => {
    if (country) {
      trigger(numberId);
    }
  }, [country, trigger, numberId]);

  const privacyPolicyLink = () => {
    return (
      <Box sx={{ textAlign: "left", width: "100%" }}>
        <Link
          href={urlConst.privacyPolicy}
          color="text.primary"
          target="_blank"
        >
          <Text
            text={t("signUp.signUpForm.privacyPolicy")}
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Link>
      </Box>
    );
  };

  const page1 = () => {
    const countryField = () => {
      const dropdownHeight: number = 200;

      const handleCountryChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<FieldValues, "country">,
      ) => {
        field.onChange(event);
        const inputCountry = event.target.value;
        setValue(countryId, inputCountry);

        try {
          const callingCode =
            countryInfoList[inputCountry as CountryCode].callingCode;
          setValue(countryCodeId, callingCode);
          trigger(numberId);
        } catch (error) {
          setValue(countryCodeId, "");
        }
      };

      return (
        <Controller
          name={countryId}
          control={control}
          defaultValue=""
          rules={{ required: t("signUp.signUpForm.countryError") }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              required
              fullWidth
              variant="filled"
              sx={formFieldStyling}
              margin={formFieldMargin}
              label={t("signUp.signUpForm.country")}
              value={country}
              onChange={(event) => handleCountryChange(event, field)}
              InputLabelProps={{ sx: { color: "text.primary" } }}
              SelectProps={{
                MenuProps: {
                  MenuListProps: {
                    sx: { maxHeight: dropdownHeight, overflowY: "auto" },
                  },
                },
              }}
            >
              {Object.values(countryInfoList).map((country) => (
                <MenuItem key={country.name} value={country.iso2}>
                  {`${country.name} ${country.flagEmoji}`}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      );
    };

    const phoneNumberSection = () => {
      const countryCodeWidth: number = 4;
      const numberWidth: number = 12 - countryCodeWidth;

      const countryCodeField = () => {
        const countryCode = getValues(countryCodeId);
        const countryCodeFilled = Boolean(countryCode);

        return (
          <Controller
            name={countryCodeId}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                sx={formFieldStyling}
                margin={formFieldMargin}
                label={t("signUp.signUpForm.countryCode")}
                value={countryCode}
                InputProps={{ readOnly: true }}
                InputLabelProps={{
                  sx: { color: "text.primary" },
                  shrink: countryCodeFilled,
                }}
              />
            )}
          />
        );
      };

      const numberField = () => {
        const phoneNumberValidation = (value: string) => {
          const isValid = isValidPhoneNumber(value, country);
          return isValid ? true : t("signUp.signUpForm.numberError");
        };

        return (
          <Controller
            name={numberId}
            control={control}
            defaultValue=""
            rules={{
              validate: phoneNumberValidation,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                sx={formFieldStyling}
                margin={formFieldMargin}
                label={t("signUp.signUpForm.number")}
                InputLabelProps={{
                  sx: { color: "text.primary" },
                }}
                error={!!errors.number}
                helperText={
                  errors.number ? (errors.number.message as string) : ""
                }
                onChange={(event) => {
                  field.onChange(event.target.value);
                  trigger(numberId);
                }}
              />
            )}
          />
        );
      };

      return (
        <Grid container spacing={2}>
          <Grid item xs={countryCodeWidth}>
            {countryCodeField()}
          </Grid>
          <Grid item xs={numberWidth}>
            {numberField()}
          </Grid>
        </Grid>
      );
    };

    const nextButton = () => {
      const buttonWidth: string = "30%";

      const handleClick = async () => {
        const isCountryValid = await trigger(countryId);
        const isNumberValid = await trigger(numberId);

        if (isCountryValid && isNumberValid) setPageNumber(2);
      };

      return (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth, ml: "auto" }}
          onClick={handleClick}
        >
          <Text
            text={t("signUp.signUpForm.next")}
            variant={TypographyVariant.h4}
            bold={false}
          />
        </Button>
      );
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {countryField()}
        {phoneNumberSection()}
        {privacyPolicyLink()}
        {nextButton()}
      </Box>
    );
  };

  const page2 = () => {
    return <Box></Box>;
  };

  const divider = () => {
    const gapBetweenLines: number = 4;
    const lineThickness: number = 3;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          my: formMargin,
        }}
      >
        <Divider
          sx={{
            flexGrow: 1,
            borderBottomWidth: lineThickness,
            borderBottomColor: "text.primary",
          }}
        />
        <Box
          sx={{
            mx: gapBetweenLines,
            color: "text.primary",
            fontWeight: "bold",
          }}
        >
          <Text
            text={t("signUp.signUpForm.or")}
            variant={TypographyVariant.h3}
            bold={true}
          />
        </Box>
        <Divider
          sx={{
            flexGrow: 1,
            borderBottomWidth: lineThickness,
            borderBottomColor: "text.primary",
          }}
        />
      </Box>
    );
  };

  return (
    <Box
      component="form"
      // onSubmit={handleSubmit}
      noValidate
      marginTop={formMargin}
    >
      {pageNumber === 1 ? page1() : page2()}
      {divider()}
    </Box>
  );
};

export default SignUpForm;
