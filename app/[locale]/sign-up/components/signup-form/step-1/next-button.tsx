import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useSignup } from "@/hooks/useSignup";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { SIGNUP_STYLES } from "../../styles";

const NextButton = () => {
  const { trigger, setStepNumber } = useSignup();

  const t = useTranslations("signUp.signUpForm");
  const styles = SIGNUP_STYLES;

  const handleClick = async () => {
    const isCountryValid = await trigger("country");
    const isNumberValid = await trigger("number");

    if (isCountryValid && isNumberValid) setStepNumber(2);
  };

  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      sx={{ my: styles.FORM_MARGIN, maxWidth: styles.BUTTON_WIDTH, ml: "auto" }}
      onClick={handleClick}
    >
      <Text text={t("next")} variant={TypographyVariant.button} bold={false} />
    </Button>
  );
};

export default NextButton;
