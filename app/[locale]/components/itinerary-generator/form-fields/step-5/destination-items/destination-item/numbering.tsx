import { HOME_STYLES } from "@/app/[locale]/components/styles";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Box } from "@mui/material";

const Numbering = ({ index }: { index: number }) => {
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_5;

  return (
    <Box sx={{ mr: styles.NUMBERING_RIGHT_MARGIN }}>
      <Text
        text={index + 1 + ")"}
        variant={TypographyVariant.h6}
        bold={false}
      />
    </Box>
  );
};

export default Numbering;
