import Text from "@/components/atoms/text";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { useAccount } from "@/hooks/useAccount";
import { useChangePassword } from "@/hooks/useChangePassword";
import { Button, CircularProgress } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useTranslations } from "next-intl";
import { ACCOUNT_PERFONAL_INFORMATION_STYLES } from "../../styles";

const UpdateButton = () => {
  const {
    trigger,
    currentPassword,
    newPassword,
    setAlertText,
    setAlertType,
    setShowAlert,
    setIsChangingPassword,
    changeUserPassword,
    isChangingPassword,
  } = useChangePassword();
  const { session } = useAccount();

  const t = useTranslations("account.personalInformation.changePassword");
  const styles = ACCOUNT_PERFONAL_INFORMATION_STYLES;

  const handleOnClick = async () => {
    const isCurrentPasswordValid = await trigger("currentPassword");
    const isNewPasswordValid = await trigger("newPassword");
    const isReEnterNewPasswordValid = await trigger("reEnterNewPassword");

    if (
      !isCurrentPasswordValid ||
      !isNewPasswordValid ||
      !isReEnterNewPasswordValid
    )
      return;

    if (currentPassword === newPassword) {
      setAlertText(t("samePasswordError"));
      setAlertType(AlertType.error);
      setShowAlert(true);
      return;
    }

    setIsChangingPassword(true);
    setAlertText("");
    setShowAlert(false);
    const email = session?.user.email!;
    const name = session?.user.name;
    const data = {
      email,
      name,
      currentPassword,
      newPassword,
    };

    try {
      await changeUserPassword.mutateAsync(data);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        setAlertType(AlertType.error);
        setAlertText(error.message);
        setShowAlert(true);
      }
    } finally {
      setIsChangingPassword(false);
    }
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
      color="secondary"
      disabled={isChangingPassword}
      onClick={handleOnClick}
    >
      {isChangingPassword ? (
        <CircularProgress
          size={styles.CHANGE_PASSWORD_FORM.LOADING_ANIMATION_SIZE}
        />
      ) : (
        <Text
          text={t("update")}
          variant={TypographyVariant.button}
          bold={false}
        />
      )}
    </Button>
  );
};

export default UpdateButton;
