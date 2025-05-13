import Text from "@/components/atoms/text";
import colorsConst from "@/constants/pages/colors.json";
import urlsConst from "@/constants/urls.json";
import { useAccount } from "@/hooks/useAccount";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ACCOUNT_BASE_STYLES } from "../styles";

const PrivacyPolicy = () => {
  const t = useTranslations("account");
  const { router } = useAccount();
  const styles = ACCOUNT_BASE_STYLES;

  const handleOnClick = () => {
    router.replace(urlsConst.privacyPolicy);
  };

  return (
    <Button
      sx={{
        color: colorsConst.palette.text.primary,
      }}
      onClick={handleOnClick}
    >
      <Text
        text={t("privacyPolicy")}
        variant={styles.BUTTON_TYPOGRAPHY_VARIANT}
        bold={false}
      />
    </Button>
  );
};

export default PrivacyPolicy;
