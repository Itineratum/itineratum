import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useTranslations } from "next-intl";

const AllOffersAndUpdates = () => {
  const t = useTranslations("account.notifications");

  return (
    <Text
      text={t("allOffersAndUpdates")}
      variant={TypographyVariant.h6}
      bold={true}
    />
  );
};

export default AllOffersAndUpdates;
