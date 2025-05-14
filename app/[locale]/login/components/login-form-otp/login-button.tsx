import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useLogin } from "@/hooks/useLogin";
import { Box, Button, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOGIN_STYLES } from "../styles";

const LoginButton = () => {
  const { isLoggingIn } = useLogin();

  const styles = LOGIN_STYLES;
  const t = useTranslations("login.loginForm");

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          my: styles.FORM_MARGIN,
          maxWidth: styles.LOGIN_BUTTON.BUTTON_WIDTH,
        }}
        color="primary"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <CircularProgress size={styles.LOGIN_BUTTON.LOADING_ANIMATION_SIZE} />
        ) : (
          <Text
            text={t("login")}
            variant={TypographyVariant.button}
            bold={false}
          />
        )}
      </Button>
    </Box>
  );
};

export default LoginButton;
