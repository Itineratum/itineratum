import { signIn } from "next-auth/react";
import constEndpoints from "@/constants/pages/endpoints.json";
import { Box, Button } from "@mui/material";
import colorsConst from "@/constants/pages/colors.json";
import Image from "next/image";
import googleIcon from "@/public/google.png";
import Text from "../atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useTranslations } from "next-intl";

export const ContinueWithGoogleButton = ({
  formMargin,
}: {
  formMargin: number;
}) => {
  const t = useTranslations();

  const buttonWidth: string = "80%";
  const iconSize: number = 32;
  const buttonHeight: number = iconSize * 2;
  const spacing: number = 2;

  const handleClick = () => {
    signIn("google", { callbackUrl: constEndpoints.home.endpoint });
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
          text={t("signUp.signUpForm.continueWithGoogle")}
          variant={TypographyVariant.h3}
          bold={false}
        />
      </Button>
    </Box>
  );
};
