import { HOME_STYLES } from "@/app/[locale]/components/styles";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { UserRequestedDestination } from "@/constants/types/formData/generateItineraryFormData";
import { Grid } from "@mui/material";
import Numbering from "./numbering";
import DaysAllocationItem from "./days-allocation-item";

const DestinationItem = ({
  destination,
  index,
}: {
  destination: UserRequestedDestination;
  index: number;
}) => {
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_5;

  return (
    <Grid
      container
      sx={styles.DESTINATION_ITEM.BOX_SX}
      key={index}
      spacing={styles.SPACING}
    >
      <Grid
        item
        xs={12}
        md={styles.LEFT_SECTION}
        sx={{ display: "flex", direction: "row", alignItems: "center" }}
      >
        <Numbering index={index} />
        <Text
          text={destination.name}
          variant={TypographyVariant.h6}
          bold={false}
        />
      </Grid>
      <Grid item xs={12} md={styles.RIGHT_SECTION} sx={{ display: "flex" }}>
        <DaysAllocationItem destination={destination} />
      </Grid>
    </Grid>
  );
};

export default DestinationItem;
