import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

const textLabelMarginRight: number = 2;
const inputLabelWidth: string = "75%";
const inputLabelProps = {
  style: {
    color: colorsConst.palette.text.grey,
    fontSize: "12px",
    width: inputLabelWidth,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  shrink: undefined,
};
const mobileSpacing = 1;

const handleOnFocus = (e: any) => {
  e.target.labels[0].style.overflow = "visible";
  e.target.labels[0].style.whiteSpace = "normal";
  e.target.labels[0].style.width = "100%";
};
const handleOnBlur = (e: any) => {
  e.target.labels[0].style.overflow = inputLabelProps.style.overflow;
  e.target.labels[0].style.textOverflow = inputLabelProps.style.textOverflow;
  e.target.labels[0].style.whiteSpace = inputLabelProps.style.whiteSpace;
  e.target.labels[0].style.width = inputLabelWidth;
};

const OriginField = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step1");

  const fieldId = "originCountry";

  return (
    <Box
      display="flex"
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
          text={t("origin") + ":"}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Box>
      <Controller
        name={fieldId}
        control={fields.control}
        render={({ field }) => (
          <TextField
            {...fields.register(fieldId)}
            variant="outlined"
            label={t("originDescription")}
            fullWidth
            InputLabelProps={inputLabelProps}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        )}
      />
    </Box>
  );
};

const DestinationField = ({
  destination: currentDestination,
  setDestination,
}: {
  destination: string;
  setDestination: Dispatch<SetStateAction<string>>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step1");

  const textLabelMarginRight: number = 2;

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
          text={t("destinations") + ":"}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Box>
      <TextField
        variant="outlined"
        label={t("destinationsDescription")}
        fullWidth
        value={currentDestination}
        InputLabelProps={inputLabelProps}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={(e) => {
          setDestination(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <IconButton>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};

export { DestinationField, OriginField };
