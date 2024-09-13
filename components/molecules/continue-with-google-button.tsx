import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import googleIcon from "@/public/google.png";
import { Box, Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Text from "../atoms/text";

export const ContinueWithGoogleButton = ({
  formMargin,
}: {
  formMargin: number;
}) => {
  const t = useTranslations("signUp.signUpForm");

  const buttonWidth: string = "80%";
  const iconSize: number = 32;
  const buttonHeight: number = iconSize * 2;
  const spacing: number = 2;

  const handleClick = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
        onClick={handleClick}
      >
        <Image
          src={googleIcon}
          width={iconSize}
          height={iconSize}
          alt={"Google Icon"}
        />
        <Text
          text={t("continueWithGoogle")}
          variant={TypographyVariant.h3}
          bold={false}
        />
      </Button>
    </Box>
  );
};
