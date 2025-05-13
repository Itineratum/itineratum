import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ACCOUNT_PERFONAL_INFORMATION_STYLES } from "../styles";

const DeleteAccountButton = () => {
  const { setShowConfirmDeleteDialog: setShowConformDeleteDialog, isUpdating } =
    usePersonalInformation();

  const t = useTranslations("account.personalInformation");
  const styles = ACCOUNT_PERFONAL_INFORMATION_STYLES.RIGHT_COLUMN;

  const handleOnClick = async () => {
    setShowConformDeleteDialog(true);
  };

  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      sx={{ maxWidth: styles.BUTTON_WIDTH, alignSelf: "center" }}
      color="primary"
      disabled={isUpdating}
      onClick={handleOnClick}
    >
      <Text
        text={t("deleteAccount")}
        variant={TypographyVariant.button}
        bold={false}
      />
    </Button>
  );
};

export default DeleteAccountButton;
