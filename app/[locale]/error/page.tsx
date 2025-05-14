"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { getSignInErrorMessage } from "@/constants/errors/signIn";
import constEndpoints from "@/constants/pages/endpoints.json";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import { Box, Button } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Error = () => {
  const t = useTranslations("error");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const errorMessage = getSignInErrorMessage(searchParams.get("error") ?? "");

  const heightBetweenErrorTextAndButton: number = 30;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
    >
      <Text text={errorMessage} variant={TypographyVariant.h2} bold={false} />
      <Box sx={{ height: heightBetweenErrorTextAndButton }} />
      {/* home button */}
      <Link href={buildLocaleEndpoint(locale, constEndpoints.home.endpoint)}>
        <Button variant="contained">
          <Text
            text={t("home")}
            variant={TypographyVariant.button}
            bold={false}
          />
        </Button>
      </Link>
    </Box>
  );
};

export default Error;
