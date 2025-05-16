import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Box, Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { HOME_STYLES } from "../../../styles";
import AdultsField from "./adults-field";
import BudgetField from "./budget-field";
import ChildrenField from "./children-field";
import TotalHotelRoomsField from "./total-hotel-rooms-field";

const Step2 = ({}: {}) => {
  const t = useTranslations("home.itineraryGenerator.step2");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_2;

  return (
    <Stack
      spacing={styles.SPACING + 5}
      direction="column"
      alignItems="center"
      sx={{ display: "flex", alignItems: "flex-end" }}
    >
      {/* budget and hotel rooms section */}
      <Grid container spacing={styles.SPACING} alignItems="center">
        <Grid item xs={12} md={5}>
          <BudgetField />
        </Grid>
        <Grid item xs={12} md={7}>
          <TotalHotelRoomsField />
        </Grid>
      </Grid>
      {/* num of travellers section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: styles.SPACING,
          alignItems: "flex-start",
        }}
      >
        <Text
          text={t("numTravellers") + ":"}
          variant={TypographyVariant.h4}
          bold={true}
        />
        <Stack
          spacing={styles.SPACING}
          direction="column"
          alignItems="flex-start"
          width="100%"
        >
          <AdultsField />
          <ChildrenField />
        </Stack>
      </Box>
    </Stack>
  );
};

export default Step2;
