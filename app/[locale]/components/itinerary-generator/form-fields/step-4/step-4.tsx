import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { HOME_STYLES } from "../../../styles";
import PreferredTransportRadioSection from "./preferred-transport-radio-section/preferred-transport-radio-section";

const Step4 = ({}: {}) => {
  const t = useTranslations("home.itineraryGenerator.step4");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_4;

  return (
    <Box
      sx={{
        display: "flex",
        gap: styles.SPACING,
        flexDirection: { xs: "column", md: "row" },
        alignItems: "flex-start",
      }}
    >
      {/* label */}
      <Text
        text={t("transport") + ": "}
        variant={TypographyVariant.h4}
        bold={true}
      />
      <PreferredTransportRadioSection />
    </Box>
  );
};

export default Step4;
