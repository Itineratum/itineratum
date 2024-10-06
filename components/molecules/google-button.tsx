import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import googleIcon from "@/public/google.png";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Text from "../atoms/text";

export const GoogleButton = ({
  formMargin,
  buttonWidth = "80%",
}: {
  formMargin: number;
  buttonWidth?: string;
}) => {
  const t = useTranslations("googleButton");

  const iconSize: number = 32;
  const buttonHeight: number = iconSize * 2;
  const spacing: number = 2;

  const handleOnClick = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      sx={{
        my: formMargin,
        maxWidth: buttonWidth,
        height: buttonHeight,
        gap: spacing,
        backgroundColor: colorsConst.continueWithGoogleButton.color,
        color: colorsConst.continueWithGoogleButton.textColor,
      }}
      onClick={handleOnClick}
    >
      <Image
        src={googleIcon}
        width={iconSize}
        height={iconSize}
        alt={"Google Icon"}
      />
      <Text
        text={t("continueWithGoogle")}
        variant={TypographyVariant.h4}
        bold={false}
      />
    </Button>
  );
};
