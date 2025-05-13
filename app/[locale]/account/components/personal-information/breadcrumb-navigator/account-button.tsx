import Text from "@/components/atoms/text";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAccount } from "@/hooks/useAccount";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

const AccountButton = () => {
  const t = useTranslations("account.personalInformation");
  const {setAccountSetting, accountSetting} = useAccount();

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
