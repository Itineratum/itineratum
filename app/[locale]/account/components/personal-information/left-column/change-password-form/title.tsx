import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useTranslations } from "next-intl";

const Title = () => {
  const t = useTranslations("account.personalInformation.changePassword");

  return (
    <Text
      text={t("changePassword")}
      variant={TypographyVariant.h5}
      bold={false}
    />
  );
};

export default Title;
