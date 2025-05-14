import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { useLogin } from "@/hooks/useLogin";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";

const LoginUsingPhoneNumberButton = () => {
  const { setIsLoginUsingOtp } = useLogin();

  const t = useTranslations("login.loginForm");

  const handleOnClick = () => {
    setIsLoginUsingOtp(true);
  };

  return (
    <Box
      sx={{ textAlign: "right", width: "100%", cursor: "pointer" }}
      onClick={handleOnClick}
    >
      <Text
        text={t("loginUsingPhoneNumber")}
        variant={TypographyVariant.subtitle2}
        bold={false}
        textDecoration={TypographyTextDecoration.underline}
      />
    </Box>
  );
};

export default LoginUsingPhoneNumberButton;
