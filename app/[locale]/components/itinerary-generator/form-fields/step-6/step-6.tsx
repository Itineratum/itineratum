import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { HOME_STYLES } from "../../../styles";
import OtherRequirementCheckboxSection from "./other-requirements-checkbox-section/other-requirement-checkbox-section";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";

const Step6 = ({}: {}) => {
  const { fields } = useItineraryGenerator();

  const t = useTranslations("home.itineraryGenerator.step6");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_6;

  return (
    <Box
      sx={{
        display: "flex",
        gap: styles.SPACING,
        flexDirection: {
          xs: "column",
          md: "row",
          alignItems: "flex-start",
          justifyContent: "center",
        },
      }}
    >
      {/* label section */}
      <Text
        text={t("otherRequirements") + ": "}
        variant={TypographyVariant.h4}
        bold={true}
      />
      <OtherRequirementCheckboxSection />
    </Box>
  );
};

export default Step6;
