import Text from "@/components/atoms/text";
import colorsConst from "@/constants/pages/colors.json";
import endpointsConst from "@/constants/pages/endpoints.json";
import { useAccount } from "@/hooks/useAccount";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ACCOUNT_BASE_STYLES } from "../styles";

const TermsAndConditions = () => {
  const t = useTranslations("account");
  const { router } = useAccount();
  const styles = ACCOUNT_BASE_STYLES;

  const handleOnClick = () => {
    router.replace(endpointsConst.termsAndConditions.endpoint);
  };

  return (
    <Button
      sx={{
        color: colorsConst.palette.text.primary,
        textDecoration: "none",
      }}
      onClick={handleOnClick}
    >
      <Text
        text={t("termsAndConditions")}
        variant={styles.BUTTON_TYPOGRAPHY_VARIANT}
        bold={false}
      />
    </Button>
  );
};

export default TermsAndConditions;
