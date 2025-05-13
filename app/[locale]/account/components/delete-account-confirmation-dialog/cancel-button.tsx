import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

const CancelButton = () => {
  const { closeConfirmDeleteDialog } = usePersonalInformation();

  const t = useTranslations("account.personalInformation.deleteAccountDialog");

  const handleOnClick = () => {
    closeConfirmDeleteDialog();
  };

  return (
    <Button onClick={handleOnClick} variant="outlined">
      <Text
        text={t("cancelButton")}
        variant={TypographyVariant.button}
        bold={false}
      />
    </Button>
  );
};

export default CancelButton;
