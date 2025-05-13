import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useTranslations } from "next-intl";
import colorsConst from "@/constants/pages/colors.json";

const Status = ({ isEnabled }: { isEnabled: boolean }) => {
  const t = useTranslations("account.notifications");

  return (
    <Text
      text={isEnabled ? t("on") : t("off")}
      variant={TypographyVariant.subtitle1}
      bold={false}
      color={colorsConst.palette.text.grey}
    />
  );
};

export default Status;
