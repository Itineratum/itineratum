import Text from "@/components/atoms/text";
import colorsConst from "@/constants/pages/colors.json";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ACCOUNT_BASE_STYLES } from "../styles";

const Accessibility = () => {
  const t = useTranslations("account");
  const styles = ACCOUNT_BASE_STYLES;

  return (
    <Button
      sx={{
        color: colorsConst.palette.text.primary,
      }}
    >
      <Text
        text={t("accessibility")}
        variant={styles.BUTTON_TYPOGRAPHY_VARIANT}
        bold={false}
      />
    </Button>
  );
};

export default Accessibility;
