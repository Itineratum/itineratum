import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";

const NoTravelTimes = () => {
  const t = useTranslations("itinerary");

  return (
    <Box display="flex" justifyContent="center">
      <Text
        text={t("noTravelTimes")}
        variant={TypographyVariant.body1}
        bold={false}
      />
    </Box>
  );
};

export default NoTravelTimes;
