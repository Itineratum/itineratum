import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useTranslations } from "next-intl";
import colorsConst from "@/constants/pages/colors.json";

const Description = () => {
  const t = useTranslations("account.notifications");

  return (
    <Text
      text={t("unsubAllOffersUpdatesDescription")}
      variant={TypographyVariant.subtitle1}
      bold={false}
      color={colorsConst.palette.text.grey}
    />
  );
};

export default Description;
