import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useTranslations } from "next-intl";

const Header = () => {
  const t = useTranslations("account.notifications");

  return (
    <Text
      text={t("unsubAllOffersUpdates")}
      variant={TypographyVariant.h5}
      bold={true}
    />
  );
};

export default Header;
