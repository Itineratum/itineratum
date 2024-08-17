import { TypographyVariant } from "@/constants/enums/theme";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Text from "../atoms/text";

const SignInButton = () => {
  const t = useTranslations();

  return (
    <Button
      sx={{
        mx: 2.5,
        color: "white",
        backgroundColor: "black",
        "&:hover": { backgroundColor: "#ff8161" },
      }}
      onClick={() => signIn()}
    >
      <Text
        text={t("navbar.account.signIn")}
        variant={TypographyVariant.h4}
        bold={true}
      />
    </Button>
  );
};

export default SignInButton;
