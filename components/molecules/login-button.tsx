import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import endpointConst from "@/constants/pages/endpoints.json";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import { Button } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Text from "../atoms/text";

const LoginButton = () => {
  const t = useTranslations();
  const locale = useLocale();
  const color = colorsConst.components.loginButton;

  return (
    <Link href={buildLocaleEndpoint(locale, endpointConst.login.endpoint)}>
      <Button
        sx={{
          mx: 2.5,
          color: color.color,
          backgroundColor: color.backgroundColor,
          "&:hover": { backgroundColor: color.hoverBackgroundColor },
        }}
      >
        <Text
          text={t("navbar.account.login")}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Button>
    </Link>
  );
};

export default LoginButton;
