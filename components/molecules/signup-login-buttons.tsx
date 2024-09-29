import { TypographyVariant } from "@/constants/enums/theme";
import endpointConst from "@/constants/pages/endpoints.json";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import { Box, Button } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Text from "../atoms/text";

const SignupLoginButtons = () => {
  const buttonMargin: number = 1;
  const buttonTextColor: string = "text.primary";
  const t = useTranslations("navbar.account");
  const locale = useLocale();
  const typographyVariant: TypographyVariant = TypographyVariant.h6;

  const LoginButton = () => {
    return (
      <Link href={buildLocaleEndpoint(locale, endpointConst.login.endpoint)}>
        <Button
          sx={{
            mx: buttonMargin,
            color: buttonTextColor,
          }}
        >
          <Text text={t("login")} variant={typographyVariant} bold={true} />
        </Button>
      </Link>
    );
  };

  const SignupButton = () => {
    return (
      <Link href={buildLocaleEndpoint(locale, endpointConst.signUp.endpoint)}>
        <Button
          sx={{
            mx: buttonMargin,
            color: buttonTextColor,
          }}
        >
          <Text text={t("signUp")} variant={typographyVariant} bold={true} />
        </Button>
      </Link>
    );
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <SignupButton />
      |
      <LoginButton />
    </Box>
  );
};

export default SignupLoginButtons;
