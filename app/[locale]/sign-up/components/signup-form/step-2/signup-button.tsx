import Text from "@/components/atoms/text";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { useSignup } from "@/hooks/useSignup";
import { Button, CircularProgress } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useTranslations } from "next-intl";
import { SIGNUP_STYLES } from "../../styles";

const SignupButton = () => {
  const {
    trigger,
    setIsSigningUp,
    setAlertText,
    setShowAlert,
    setAlertType,
    isSigningUp,
    generateVerificationCode,
    email,
  } = useSignup();

  const t = useTranslations("signUp.signUpForm");
  const styles = SIGNUP_STYLES;

  const handleOnClick = async () => {
    const isEmailValid = await trigger("email");
    const isPasswordValid = await trigger("password");
    const isReEnterPasswordValid = await trigger("reEnterPassword");

    if (!isEmailValid || !isPasswordValid || !isReEnterPasswordValid) return;

    setIsSigningUp(true);
    setAlertText("");
    setShowAlert(false);
    const data = {
      email,
    };

    try {
      await generateVerificationCode.mutateAsync(data);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        setAlertText(error.message ?? t("signUpErrorAlert"));
        setAlertType(AlertType.error);
        setShowAlert(true);
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      sx={{ my: styles.FORM_MARGIN, maxWidth: styles.BUTTON_WIDTH }}
      color="secondary"
      disabled={isSigningUp}
      onClick={handleOnClick}
    >
      {isSigningUp ? (
        <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
      ) : (
        <Text
          text={t("signUp")}
          variant={TypographyVariant.button}
          bold={false}
        />
      )}
    </Button>
  );
};

export default SignupButton;
