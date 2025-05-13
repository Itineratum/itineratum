import { Button } from "@mui/material";Text
import Text from "@/components/atoms/text";
import { useTranslations } from "next-intl";
import colorsConst from "@/constants/pages/colors.json";
import { ACCOUNT_BASE_STYLES } from "../styles";
import { useAccount } from "@/hooks/useAccount";
import { AccountSetting } from "@/constants/enums/accountSetting";

const PersonalInformation = () => {
  const { setAccountSetting } = useAccount();
  const t = useTranslations("account");
  const styles = ACCOUNT_BASE_STYLES;

  const handleOnClick = () => {
    setAccountSetting(AccountSetting.personalInformation);
  };

  return (
    <Button
      sx={{
        color: colorsConst.palette.text.primary,
      }}
      onClick={handleOnClick}
    >
      <Text
        text={t("personalInformation.personalInformation")}
        variant={styles.BUTTON_TYPOGRAPHY_VARIANT}
        bold={false}
      />
    </Button>
  );
}

export default PersonalInformation;