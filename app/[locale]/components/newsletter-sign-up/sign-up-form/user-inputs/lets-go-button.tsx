import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import { isValidEmail } from "@/utils/signUpFormValidation";
import { Box, Button, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { HOME_STYLES } from "../../../styles";

const LetsGoButton = () => {
  const {
    email,
    name,
    trigger,
    isSubmitting,
    setIsSubmitting,
    addEmailToNewsLetter,
  } = useNewsletterSignup();

  const t = useTranslations("home.newsletterSignup");
  const styles = HOME_STYLES.NEWSLETTER_SIGNUP;

  const canSubmit = () =>
    !(email && isValidEmail(email) && name ? true : false);

  const handleOnClick = async () => {
    const isEmailValid = await trigger("email");

    if (!isEmailValid) return;

    setIsSubmitting(true);
    const data = { name, email };
    addEmailToNewsLetter.mutateAsync(data);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        color="secondary"
        type="submit"
        disabled={canSubmit()}
        onClick={handleOnClick}
      >
        {isSubmitting ? (
          <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
        ) : (
          <Text
            text={t("letsGo")}
            variant={TypographyVariant.subtitle1}
            bold={false}
            color="text.secondary"
          />
        )}
      </Button>
    </Box>
  );
};

export default LetsGoButton;
