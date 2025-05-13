import Text from "@/components/atoms/text";
import { useTranslations } from "next-intl";
import { ACCOUNT_BASE_STYLES } from "../styles";
import { TypographyTextDecoration } from "@/constants/enums/theme";

const Header = () => {
  const t = useTranslations("account");
  const styles = ACCOUNT_BASE_STYLES;

  return (
    <Text
      text={t("settings")}
      variant={styles.HEADER_TYPOGRAPHY_VARIANT}
      bold={false}
      textDecoration={TypographyTextDecoration.underline}
    />
  );
}

export default Header;