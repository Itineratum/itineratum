import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useStep1 } from "@/hooks/useStep1";
import { useTranslations } from "next-intl";

const DateErrorMessage = () => {
  const { dateError } = useStep1();

  const t = useTranslations("home.itineraryGenerator.step1");

  return dateError ? (
    <Text
      text={t("dateErrorMessage")}
      variant={TypographyVariant.h6}
      bold={true}
      color="red"
    />
  ) : null;
};

export default DateErrorMessage;
