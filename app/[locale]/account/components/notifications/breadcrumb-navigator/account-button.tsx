import Text from "@/components/atoms/text";
import colorsConst from "@/constants//pages/colors.json";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { TypographyVariant } from "@/constants/enums/theme";
import { useAccount } from "@/hooks/useAccount";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

const AccountButton = () => {
  const { accountSetting, setAccountSetting } = useAccount();

  const t = useTranslations("account.notifications");

  const handleOnClick = () => {
    // go back to account base page
    setAccountSetting(AccountSetting.base);
  };

  return (
    <Button
      sx={{
        color:
          accountSetting === AccountSetting.base
            ? colorsConst.breadcrumbNavigator.selected
            : colorsConst.breadcrumbNavigator.unselected,
      }}
      onClick={handleOnClick}
    >
      <Text text={t("account")} variant={TypographyVariant.h5} bold={false} />
    </Button>
  );
};

export default AccountButton;
