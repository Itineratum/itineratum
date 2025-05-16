import { HOME_STYLES } from "@/app/[locale]/components/styles";
import { GenerateItineraryPreferredTransport } from "@/constants/enums/generateItinerary";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { RadioGroup, Stack } from "@mui/material";
import RadioButton from "./radio-button";

const PreferredTransportRadioSection = () => {
  const { fields } = useItineraryGenerator();

  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_4;

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTransport = event.target
      .value as GenerateItineraryPreferredTransport;
    fields.setValue("preferredTransport", selectedTransport);
  };

  return (
    <RadioGroup
      onChange={handleOnChange}
      value={fields.getValues("preferredTransport")}
    >
      <Stack spacing={styles.SPACING} direction="row">
        <Stack spacing={styles.SPACING} direction="column">
          <RadioButton value={GenerateItineraryPreferredTransport.car} />
          <RadioButton value={GenerateItineraryPreferredTransport.train} />
          <RadioButton value={GenerateItineraryPreferredTransport.bus} />
        </Stack>
        <Stack spacing={styles.SPACING} direction="column">
          <RadioButton value={GenerateItineraryPreferredTransport.walk} />
          <RadioButton value={GenerateItineraryPreferredTransport.boat} />
        </Stack>
      </Stack>
    </RadioGroup>
  );
};

export default PreferredTransportRadioSection;
