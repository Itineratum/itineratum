import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

const LabelAndHintSection = () => {
  const t = useTranslations("home.itineraryGenerator.step3");

  return (
    <Grid item xs={6}>
      <Stack spacing={0} direction="column" alignItems="center">
        {/* label */}
        <Text
          text={t("tripFocus") + "*: "}
          variant={TypographyVariant.h4}
          bold={true}
        />
        {/* hint */}
        <Text
          text={t("tripFocusHint")}
          variant={TypographyVariant.h6}
          bold={true}
        />
      </Stack>
    </Grid>
  );
};

export default LabelAndHintSection;
