import { TypographyVariant } from "@/constants/enums/theme";
import urlConst from "@/constants/urls.json";
import { Box, Link } from "@mui/material";
import { useTranslations } from "next-intl";
import Text from "./text";

export const PrivacyPolicyLink = () => {
  const t = useTranslations("signUp.signUpForm");

  return (
    <Box sx={{ textAlign: "left", width: "100%" }}>
      <Link href={urlConst.privacyPolicy} color="text.primary" target="_blank">
        <Text
          text={t("privacyPolicy")}
          variant={TypographyVariant.h5}
          bold={false}
        />
      </Link>
    </Box>
  );
};
