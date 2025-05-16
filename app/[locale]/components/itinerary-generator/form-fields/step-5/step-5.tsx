import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { HOME_STYLES } from "../../../styles";
import DaysAllocationSection from "./days-allocation-section";

const Step5 = ({}: {}) => {
  const t = useTranslations("home.itineraryGenerator.step5");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_5;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: { xs: "column", md: "row" },
        gap: styles.SPACING,
      }}
    >
      {/* destination label */}
      <Stack spacing={styles.SPACING + 1} direction="column">
        <Text
          text={"."}
          variant={TypographyVariant.h6}
          bold={true}
          color={colorsConst.palette.text.secondary}
        />
        <Text
          text={t("destination") + ": "}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Stack>
      <DaysAllocationSection />
    </Box>
  );
};

export default Step5;
