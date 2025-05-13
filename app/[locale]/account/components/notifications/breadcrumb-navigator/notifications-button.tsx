import Text from "@/components/atoms/text";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { TypographyVariant } from "@/constants/enums/theme";
import { useAccount } from "@/hooks/useAccount";
import { Button } from "@mui/material";
import colorsConst from "@/constants/pages/colors.json";
import { useTranslations } from "next-intl";

const NotificationsButton = () => {
  const { accountSetting } = useAccount();

  const t = useTranslations("account.notifications");

  return (
    <Button
      sx={{
        color:
          accountSetting === AccountSetting.notifications
            ? colorsConst.breadcrumbNavigator.selected
            : colorsConst.breadcrumbNavigator.unselected,
      }}
    >
      <Text
        text={t("notifications")}
        variant={TypographyVariant.h5}
        bold={false}
      />
    </Button>
  );
};

export default NotificationsButton;
