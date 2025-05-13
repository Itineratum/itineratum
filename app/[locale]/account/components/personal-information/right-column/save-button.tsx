import Text from "@/components/atoms/text";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Button, CircularProgress } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useTranslations } from "next-intl";
import { ACCOUNT_PERSONAL_INFORMATION_STYLES } from "../styles";

const SaveButton = () => {
  const {
    setIsUpdating,
    setAlertText,
    setAlertType,
    setShowAlert,
    email,
    firstName,
    lastName,
    address1,
    address2,
    dateOfBirth,
    updateUserAccount,
    isUpdating,
  } = usePersonalInformation();

  const t = useTranslations("account.personalInformation");
  const styles = ACCOUNT_PERSONAL_INFORMATION_STYLES.RIGHT_COLUMN;

  const handleOnClick = async () => {
    setIsUpdating(true);
    setAlertType(AlertType.success);
    setAlertText(t("accountUpdated"));
    setShowAlert(true);
    const data = {
      email,
      firstName,
      lastName,
      address1,
      address2,
      // this is to ensure that the MongoDB stores the date of birth as UTC, and this component will also display the date of birth as UTC
      dateOfBirth: dateOfBirth
        ? dateOfBirth.utc(true).startOf("day").toISOString()
        : undefined,
    };

    try {
      await updateUserAccount.mutateAsync(data);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        setAlertType(AlertType.error);
        setAlertText(t("accountUpdateError"));
        setShowAlert(true);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      sx={{ maxWidth: styles.BUTTON_WIDTH, alignSelf: "center" }}
      color="secondary"
      disabled={isUpdating}
      onClick={handleOnClick}
    >
      {isUpdating ? (
        <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
      ) : (
        <Text
          text={t("saveAccount")}
          variant={TypographyVariant.button}
          bold={false}
        />
      )}
    </Button>
  );
};

export default SaveButton;
