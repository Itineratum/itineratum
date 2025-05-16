import { GenerateItineraryPreferredTransport } from "@/constants/enums/generateItinerary";
import { FormControlLabel, Radio } from "@mui/material";

const RadioButton = ({
  value,
}: {
  value: GenerateItineraryPreferredTransport;
}) => {
  return (
    <FormControlLabel
      value={value.toLowerCase()}
      control={<Radio sx={{ color: "black" }} />}
      label={value}
    />
  );
};

export default RadioButton;
