import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { HOME_STYLES } from "../../../styles";

const LabelSection = () => {
  const t = useTranslations("home.itineraryGenerator.step5");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_5;

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container direction="row">
        {/* empty space */}
        <Grid item xs={styles.LEFT_SECTION}>
          <Text
            text={"."}
            variant={TypographyVariant.h6}
            bold={true}
            color={colorsConst.palette.text.secondary}
          />
        </Grid>
        <Grid item xs={styles.RIGHT_SECTION}>
          <Text
            text={t("allocation")}
            variant={TypographyVariant.h6}
            bold={true}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LabelSection;
