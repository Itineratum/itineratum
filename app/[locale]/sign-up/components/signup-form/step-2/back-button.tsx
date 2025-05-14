import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useSignup } from "@/hooks/useSignup";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { SIGNUP_STYLES } from "../../styles";

const BackButton = () => {
  const { setStepNumber } = useSignup();

  const t = useTranslations("signUp.signUpForm");
  const styles = SIGNUP_STYLES;

  const handleClick = async () => {
    setStepNumber(1);
  };

  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      sx={{ my: styles.FORM_MARGIN, maxWidth: styles.BUTTON_WIDTH }}
      onClick={handleClick}
    >
      <Text text={t("back")} variant={TypographyVariant.button} bold={false} />
    </Button>
  );
};

export default BackButton;
