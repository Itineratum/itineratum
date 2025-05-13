import Text from "@/components/atoms/text";
import colorsConst from "@/constants/pages/colors.json";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ACCOUNT_BASE_STYLES } from "../styles";
import { useAccount } from "@/hooks/useAccount";
import { AccountSetting } from "@/constants/enums/accountSetting";

const Notifications = () => {
  const { setAccountSetting } = useAccount();
  const t = useTranslations("account");
  const styles = ACCOUNT_BASE_STYLES;
  
  const handleOnClick = () => {
    setAccountSetting(AccountSetting.notifications);
  };


  return (
    <Button
    sx={{
      color: colorsConst.palette.text.primary,
    }}
    onClick={handleOnClick}
  >
    <Text
      text={t("notifications.notifications")}
      variant={styles.BUTTON_TYPOGRAPHY_VARIANT}
      bold={false}
    />
  </Button>
  );
};

export default Notifications;
