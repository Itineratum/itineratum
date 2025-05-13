import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useChangePassword } from "@/hooks/useChangePassword";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ACCOUNT_PERSONAL_INFORMATION_STYLES } from "../../styles";

const CancelButton = () => {
  const { cancelChangePassword, isChangingPassword } = useChangePassword();

  const t = useTranslations("account.personalInformation.changePassword");
  const styles = ACCOUNT_PERSONAL_INFORMATION_STYLES;

  const handleOnClick = () => {
    cancelChangePassword();
  };

  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      sx={{
        my: styles.FORM_MARGIN,
        maxWidth: styles.CHANGE_PASSWORD_FORM.BUTTON_WIDTH,
      }}
      color="primary"
      disabled={isChangingPassword}
      onClick={handleOnClick}
    >
      <Text
        text={t("cancel")}
        variant={TypographyVariant.button}
        bold={false}
      />
    </Button>
  );
};

export default CancelButton;
