"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const width: string = "30%";
  const t = useTranslations("protected");
  const router = useRouter();

  const handleOnClick = () => {
    router.push("/login");
  };

  return (
    <Button
      type="button"
      variant="contained"
      color="secondary"
      sx={{ maxWidth: width }}
      onClick={handleOnClick}
    >
      <Text text={t("login")} variant={TypographyVariant.h4} bold={false} />
    </Button>
  );
};

export default LoginButton;
