import Text from "@/components/atoms/text";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAccount } from "@/hooks/useAccount";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

const PersonalInformationButton = () => {
  const t = useTranslations("account.personalInformation");
  const { accountSetting } = useAccount();

  return (
    <Button
      sx={{
        color:
          accountSetting === AccountSetting.personalInformation
            ? colorsConst.breadcrumbNavigator.selected
            : colorsConst.breadcrumbNavigator.unselected,
      }}
    >
      <Text
        text={t("personalInformation")}
        variant={TypographyVariant.h5}
        bold={false}
      />
    </Button>
  );
};

export default PersonalInformationButton;
