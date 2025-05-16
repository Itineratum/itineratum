import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { HOME_STYLES } from "./styles";

const TextSection = () => {
  const t = useTranslations("home");
  const styles = HOME_STYLES;

  return (
    <Stack
      sx={{
        width: { xs: "100%", md: styles.SECTION_WIDTH },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Text
        text={t("title")}
        variant={TypographyVariant.h4}
        bold={false}
        color={colorsConst.palette.secondary.main}
      />
      <Text text={t("tagline")} variant={TypographyVariant.h1} bold={true} />
      <Text
        text={t("callToAction")}
        variant={TypographyVariant.h4}
        bold={false}
        color={colorsConst.palette.text.grey}
      />
    </Stack>
  );
};

export default TextSection;
