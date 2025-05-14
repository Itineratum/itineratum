import Text from "@/components/atoms/text";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { useSignup } from "@/hooks/useSignup";
import { Button, CircularProgress } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useTranslations } from "next-intl";
import { SIGNUP_STYLES } from "../../styles";

const VerifyButton = () => {
  const {
    trigger,
    country,
    countryCode,
    number,
    email,
    password,
    verificationCode,
    verifyVerificationCode,
    setAlertText,
    setAlertType,
    setShowAlert,
    setIsSigningUp,
    setIsVerifying,
    isVerifying,
  } = useSignup();

  const t = useTranslations("signUp.signUpForm");
  const styles = SIGNUP_STYLES;

  const handleClick = async () => {
    const isVerificationCodeValid = await trigger("verificationCode");

    if (!isVerificationCodeValid) return;

    setIsVerifying(true);
    setAlertText("");
    setShowAlert(false);
    const data = {
      country,
      countryCode,
      number,
      email,
      password,
      verificationCode,
    };

    try {
      await verifyVerificationCode.mutateAsync(data);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        setAlertText(error.message ?? t("signUpErrorAlert"));
        setAlertType(AlertType.error);
        setShowAlert(true);
        setIsSigningUp(false);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      sx={{ my: styles.FORM_MARGIN, maxWidth: styles.BUTTON_WIDTH, ml: "auto" }}
      color="primary"
      disabled={isVerifying}
      onClick={handleClick}
    >
      {isVerifying ? (
        <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
      ) : (
        <Text
          text={t("emailVerification.emailVerificationForm.verify")}
          variant={TypographyVariant.button}
          bold={false}
        />
      )}
    </Button>
  );
};

export default VerifyButton;
