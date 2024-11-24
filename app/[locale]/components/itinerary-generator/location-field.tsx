import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";

const LocationField = ({
  textLabel,
  label,
  fieldId,
  fields,
}: {
  textLabel: string;
  label: string;
  fieldId: any;
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const textLabelMarginRight: number = 2;

  return (
    <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
      <Box mr={textLabelMarginRight}>
        <Text
          text={textLabel + ":"}
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
            label={label}
            fullWidth
            InputLabelProps={{
              style: {
                color: colorsConst.palette.text.grey,
                fontSize: "12px",
              },
            }}
            onChange={(value) => {
              field.onChange(value);
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

export default LocationField;
